import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { makeUser } from '@/tests/factories/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { BadRequestError } from '../@errors/bad-request-error';
import { UpdateUserProfileUseCase } from './update-user-profile';

let profilesRepository: InMemoryProfilesRepository;
let usersRepository: InMemoryUsersRepository;
let sut: UpdateUserProfileUseCase;

describe('UpdateUserProfileUseCase', () => {
  beforeEach(() => {
    profilesRepository = new InMemoryProfilesRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new UpdateUserProfileUseCase(profilesRepository);
  });

  it('should update user profile fields', async () => {
    const { user } = await makeUser({
      email: 'user@example.com',
      password: '123456',
      profile: {
        name: 'Old',
        surname: 'Name',
        location: 'Brazil',
      },
      usersRepository,
      profilesRepository,
    });
    const { profile } = await sut.execute({
      userId: user.id,
      name: 'New',
      surname: 'Surname',
      location: 'Portugal',
      bio: 'Bio',
      avatarUrl: 'url',
    });
    expect(profile.name).toBe('New');
    expect(profile.surname).toBe('Surname');
    expect(profile.location).toBe('Portugal');
    expect(profile.bio).toBe('Bio');
    expect(profile.avatarUrl).toBe('url');
  });

  it('should throw BadRequestError if profile not found', async () => {
    await expect(() =>
      sut.execute({ userId: 'notfound', name: 'fail' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
