import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { makeUser } from '@/tests/factories/make-user';
import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChangeMyUsernameUseCase } from './change-my-username';

let usersRepository: InMemoryUsersRepository;
let profilesRepository: InMemoryProfilesRepository;
let sut: ChangeMyUsernameUseCase;

describe('ChangeMyUsernameUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    profilesRepository = new InMemoryProfilesRepository();
    sut = new ChangeMyUsernameUseCase(usersRepository);
  });

  it('should change own username', async () => {
    const { user } = await makeUser({
      email: 'user@example.com',
      password: '123456',
      username: 'olduser',
      usersRepository,
      profilesRepository,
    });
    const result = await sut.execute({ userId: user.id, username: 'newuser' });
    expect(result.user.username).toBe('newuser');
  });

  it('should throw BadRequestError if user does not exist', async () => {
    await expect(() =>
      sut.execute({ userId: 'notfound', username: 'fail' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not allow changing to an already existing username', async () => {
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
      sut.execute({ userId: user2.id, username: 'userone' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
