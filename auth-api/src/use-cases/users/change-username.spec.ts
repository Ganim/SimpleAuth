import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { makeUser } from '@/tests/factories/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { BadRequestError } from '../@errors/bad-request-error';
import { ChangeUsernameUseCase } from './change-username';

describe('ChangeUsernameUseCase', () => {
  let usersRepository: InMemoryUsersRepository;
  let profilesRepository: InMemoryProfilesRepository;
  let sut: ChangeUsernameUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    profilesRepository = new InMemoryProfilesRepository();
    sut = new ChangeUsernameUseCase(usersRepository);
  });

  it('should change user username', async () => {
    const { user } = await makeUser({
      email: 'user@example.com',
      password: '123456',
      username: 'olduser',
      usersRepository,
      profilesRepository,
    });
    const result = await sut.execute({ id: user.id, username: 'newuser' });
    expect(result.user.username).toBe('newuser');
  });

  it('should throw BadRequestError if user not found', async () => {
    await expect(() =>
      sut.execute({ id: 'notfound', username: 'fail' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not allow changing to a username already in use', async () => {
    await makeUser({
      email: 'user1@example.com',
      password: '123456',
      username: 'userone',
      usersRepository,
      profilesRepository,
    });
    const { user: user2 } = await makeUser({
      email: 'user2@example.com',
      password: '123456',
      username: 'usertwo',
      usersRepository,
      profilesRepository,
    });
    await expect(() =>
      sut.execute({ id: user2.id, username: 'userone' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
