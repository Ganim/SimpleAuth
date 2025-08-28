import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { makeUser } from '@/tests/factories/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChangeUserUsernameUseCase } from './change-user-username';

describe('ChangeUserUsernameUseCase', () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: ChangeUserUsernameUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ChangeUserUsernameUseCase(usersRepository);
  });

  it('should change user username', async () => {
    const { user } = await makeUser({
      email: 'user@example.com',
      password: '123456',
      username: 'olduser',
      usersRepository,
    });
    const result = await sut.execute({ userId: user.id, username: 'newuser' });
    expect(result.user.username).toBe('newuser');
  });

  it('should throw ResourceNotFoundError if user not found', async () => {
    await expect(() =>
      sut.execute({ userId: 'notfound', username: 'fail' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not allow changing to a username already in use', async () => {
    await makeUser({
      email: 'user1@example.com',
      password: '123456',
      username: 'userone',
      usersRepository,
    });
    const { user: user2 } = await makeUser({
      email: 'user2@example.com',
      password: '123456',
      username: 'usertwo',
      usersRepository,
    });
    await expect(() =>
      sut.execute({ userId: user2.id, username: 'userone' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not allow username change for deleted user', async () => {
    const { user } = await makeUser({
      email: 'deleted@example.com',
      password: '123456',
      username: 'deleteduser',
      usersRepository,
    });
    const storedUser = await usersRepository.findById(user.id);
    if (storedUser) storedUser.deletedAt = new Date();
    await expect(() =>
      sut.execute({ userId: user.id, username: 'newuser' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
