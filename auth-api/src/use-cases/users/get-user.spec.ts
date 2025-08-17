import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { makeUser } from '@/tests/factories/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { BadRequestError } from '../@errors/bad-request-error';
import { GetUserUseCase } from './get-user';

let usersRepository: InMemoryUsersRepository;
let profilesRepository: InMemoryProfilesRepository;
let sut: GetUserUseCase;

describe('GetUserUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    profilesRepository = new InMemoryProfilesRepository();
    sut = new GetUserUseCase(usersRepository, profilesRepository);
  });

  it('should return user and profile by id', async () => {
    const { user } = await makeUser({
      email: 'getuser@example.com',
      password: 'hash',
      profile: {
        name: 'Get',
        surname: 'User',
      },
      usersRepository,
      profilesRepository,
    });
    const result = await sut.execute({ id: user.id });
    expect(result.user.id).toBe(user.id);
    expect(result.user.email).toBe('getuser@example.com');
    expect(result.profile).toBeDefined();
    expect(result.profile?.name).toBe('Get');
    expect(result.profile?.surname).toBe('User');
  });

  it('should return user and null profile if profile does not exist', async () => {
    const { user } = await makeUser({
      email: 'noprofile@example.com',
      password: 'hash',
      usersRepository,
      profilesRepository,
    });
    const result = await sut.execute({ id: user.id });
    expect(result.user.id).toBe(user.id);
    expect(result.profile).toBeDefined();
    expect(result.profile?.name).toBe('');
    expect(result.profile?.surname).toBe('');
    expect(result.profile?.bio).toBeNull();
    expect(result.profile?.avatarUrl).toBe('');
    expect(result.profile?.location).toBe('');
    expect(result.profile?.birthday).toBeNull();
  });

  it('should throw BadRequestError if user not found', async () => {
    await expect(() => sut.execute({ id: 'notfound' })).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
});
