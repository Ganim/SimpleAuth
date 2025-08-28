import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { makeUser } from '@/tests/factories/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChangeUserEmailUseCase } from './change-user-email';

let usersRepository: InMemoryUsersRepository;
let sut: ChangeUserEmailUseCase;

describe('ChangeUserEmailUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ChangeUserEmailUseCase(usersRepository);
  });

  it('should change user email', async () => {
    const { user } = await makeUser({
      email: 'old@example.com',
      password: '123456',
      usersRepository,
    });
    const result = await sut.execute({
      userId: user.id,
      email: 'new@example.com',
    });
    expect(result.user.email).toBe('new@example.com'); // DTO retorna string
  });

  it('should throw ResourceNotFoundError if user not found', async () => {
    await expect(() =>
      sut.execute({ userId: 'notfound', email: 'fail@example.com' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not allow changing to an email already in use', async () => {
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

  it('should not allow email change for deleted user', async () => {
    const { user } = await makeUser({
      email: 'deleted@example.com',
      password: '123456',
      usersRepository,
    });
    const storedUser = await usersRepository.findById(user.id);
    if (storedUser) storedUser.deletedAt = new Date();
    await expect(() =>
      sut.execute({ userId: user.id, email: 'new@example.com' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
