import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeUser } from '@/utils/tests/factories/core/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { ResourceNotFoundError } from '../../../@errors/use-cases/resource-not-found';
import { GetUserByUsernameUseCase } from './get-user-by-username';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserByUsernameUseCase;

describe('Get User By Username Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserByUsernameUseCase(usersRepository);
  });

  // OBJECTIVE

  it('should return the user by username', async () => {
    const { user } = await makeUser({
      email: 'getuser@example.com',
      password: 'Pass@123',
      profile: {
        name: 'Get',
        surname: 'User',
      },
      usersRepository,
    });
    const result = await sut.execute({ username: user.username });
    expect(result.user.id).toBe(user.id);
    expect(result.user.email).toBe('getuser@example.com');
    expect(result.user.profile).toBeDefined();
    expect(result.user.profile?.name).toBe('Get');
    expect(result.user.profile?.surname).toBe('User');
  });

  // REJECTS

  it('should throw ResourceNotFoundError if user does not exist', async () => {
    await expect(() =>
      sut.execute({ username: 'notfound' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should throw ResourceNotFoundError if user is deleted', async () => {
    const { user } = await makeUser({
      email: 'deleteduser@example.com',
      password: 'Pass@123',
      deletedAt: new Date(),
      usersRepository,
    });
    await expect(
      sut.execute({ username: user.username }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  // INTEGRATION

  it('should return the user with empty profile if profile data does not exist', async () => {
    const { user } = await makeUser({
      email: 'noprofile@example.com',
      password: 'Pass@123',
      usersRepository,
    });
    const result = await sut.execute({ username: user.username });

    expect(result.user.id).toBe(user.id);
    expect(result.user.profile).toBeDefined();
    expect(result.user.profile?.name).toBe('');
    expect(result.user.profile?.surname).toBe('');
    expect(result.user.profile?.bio).toBe('');
    expect(result.user.profile?.avatarUrl).toBe('');
    expect(result.user.profile?.location).toBe('');
    expect(result.user.profile?.birthday).toBeUndefined();
  });
});
