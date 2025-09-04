import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { Email } from '@/entities/core/value-objects/email';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeUser } from '@/utils/tests/factories/core/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChangeUserEmailUseCase } from './change-user-email';

let usersRepository: InMemoryUsersRepository;
let sut: ChangeUserEmailUseCase;

describe('ChangeUserEmailUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ChangeUserEmailUseCase(usersRepository);
  });

  // OBJECTIVE

  it('should change user email', async () => {
    const { user } = await makeUser({
      email: 'old@example.com',
      password: 'Pass@123',
      usersRepository,
    });

    const result = await sut.execute({
      userId: user.id,
      email: 'new@example.com',
    });

    expect(result.user.email).toBe('new@example.com');
  });

  // REJECTS

  it('should throw ResourceNotFoundError if user not found', async () => {
    await expect(() =>
      sut.execute({ userId: 'notfound', email: 'fail@example.com' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not allow changing to an email already in use', async () => {
    await makeUser({
      email: 'user1@example.com',
      password: 'Pass@123',
      usersRepository,
    });
    const { user: user2 } = await makeUser({
      email: 'user2@example.com',
      password: 'Pass@123',
      usersRepository,
    });
    await expect(() =>
      sut.execute({ userId: user2.id, email: 'user1@example.com' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not allow email change for deleted user', async () => {
    const { user } = await makeUser({
      email: 'deleted@example.com',
      password: 'Pass@123',
      usersRepository,
    });
    const storedUser = await usersRepository.findById(
      new UniqueEntityID(user.id),
    );
    if (storedUser) storedUser.deletedAt = new Date();
    await expect(() =>
      sut.execute({ userId: user.id, email: 'new@example.com' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  // VALIDATIONS

  it('should not allow invalid email format', () => {
    expect(() => Email.create('invalid-email')).toThrow(BadRequestError);
    expect(() => Email.create('user@invalid')).toThrow(BadRequestError);
    expect(() => Email.create('user@.com')).toThrow(BadRequestError);
    expect(() => Email.create('user@com')).toThrow(BadRequestError);
    expect(() => Email.create('user.com')).toThrow(BadRequestError);
  });
});
