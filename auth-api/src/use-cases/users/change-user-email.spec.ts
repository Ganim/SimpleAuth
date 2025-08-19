import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { makeUser } from '@/tests/factories/make-user';
import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChangeUserEmailUseCase } from './change-user-email';

describe('ChangeUserEmailUseCase', () => {
  let usersRepository: InMemoryUsersRepository;
  let profilesRepository: InMemoryProfilesRepository;
  let sut: ChangeUserEmailUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    profilesRepository = new InMemoryProfilesRepository();
    sut = new ChangeUserEmailUseCase(usersRepository);
  });

  it('should change user email', async () => {
    const { user } = await makeUser({
      email: 'old@example.com',
      password: '123456',
      usersRepository,
      profilesRepository,
    });
    const result = await sut.execute({ id: user.id, email: 'new@example.com' });
    expect(result.user.email).toBe('new@example.com');
  });

  it('should throw BadRequestError if user not found', async () => {
    await expect(() =>
      sut.execute({ id: 'notfound', email: 'fail@example.com' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not allow changing to an email already in use', async () => {
    await makeUser({
      email: 'user1@example.com',
      password: '123456',
      usersRepository,
      profilesRepository,
    });
    const { user: user2 } = await makeUser({
      email: 'user2@example.com',
      password: '123456',
      usersRepository,
      profilesRepository,
    });
    await expect(() =>
      sut.execute({ id: user2.id, email: 'user1@example.com' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not allow email change for deleted user', async () => {
    const { user } = await makeUser({
      email: 'deleted@example.com',
      password: '123456',
      usersRepository,
      profilesRepository,
    });
    user.deletedAt = new Date();
    await expect(() =>
      sut.execute({ id: user.id, email: 'new@example.com' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
