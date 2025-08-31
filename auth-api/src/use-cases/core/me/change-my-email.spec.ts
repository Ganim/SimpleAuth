import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { Email } from '@/entities/core/value-objects/email';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeUser } from '@/utils/tests/factories/core/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChangeMyEmailUseCase } from './change-my-email';

let usersRepository: InMemoryUsersRepository;
let sut: ChangeMyEmailUseCase;

describe('ChangeMyEmailUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ChangeMyEmailUseCase(usersRepository);
  });

  // OBJECTIVE

  it('should change own email', async () => {
    const { user } = await makeUser({
      email: 'old@example.com',
      password: '123456',
      usersRepository,
    });
    const result = await sut.execute({
      userId: user.id,
      email: 'new@example.com',
    });
    expect(result.user.email).toBe('new@example.com');
  });

  // REJECTS

  it('should throw ResourceNotFoundError if user does not exist', async () => {
    await expect(() =>
      sut.execute({ userId: 'notfound', email: 'fail@example.com' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should throw ResourceNotFoundError if user is deleted', async () => {
    const { user } = await makeUser({
      email: 'deleted@example.com',
      password: '123456',
      deletedAt: new Date(),
      usersRepository,
    });
    await expect(() =>
      sut.execute({ userId: user.id, email: 'new@example.com' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not allow changing to an already existing email', async () => {
    await makeUser({
      email: 'user1@example.com',
      password: '123456',
      usersRepository,
    });
    const { user: user2 } = await makeUser({
      email: 'user2@example.com',
      password: '123456',
      usersRepository,
    });
    await expect(() =>
      sut.execute({ userId: user2.id, email: 'user1@example.com' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  // VALIDATIONS

  it('should not allow invalid email format', () => {
    expect(() => new Email('invalid-email')).toThrow(BadRequestError);
    expect(() => new Email('user@invalid')).toThrow(BadRequestError);
    expect(() => new Email('user@.com')).toThrow(BadRequestError);
    expect(() => new Email('user@com')).toThrow(BadRequestError);
    expect(() => new Email('user.com')).toThrow(BadRequestError);
  });

  // INTEGRATION

  it('should keep correct user count after email change', async () => {
    await makeUser({
      email: 'user1@example.com',
      password: '123456',
      usersRepository,
    });
    const { user } = await makeUser({
      email: 'user2@example.com',
      password: '123456',
      usersRepository,
    });
    await sut.execute({ userId: user.id, email: 'changed@example.com' });
    const allUsers = await usersRepository.listAll();
    expect(allUsers).toHaveLength(2);
    expect(allUsers?.map((u) => u.email.value)).toContain(
      'changed@example.com',
    );
  });
});
