import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { makeUser } from '@/tests/factories/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetMyProfileUseCase } from './get-my-profile';

let usersRepository: InMemoryUsersRepository;
let profilesRepository: InMemoryProfilesRepository;
let sut: GetMyProfileUseCase;

describe('GetMyProfileUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    profilesRepository = new InMemoryProfilesRepository();
    sut = new GetMyProfileUseCase(usersRepository, profilesRepository);
  });

  it('should return all profile fields, email and username', async () => {
    const { user } = await makeUser({
      email: 'unitprofile@example.com',
      password: 'hash',
      username: 'unitprofile',
      role: 'USER',
      profile: {
        name: 'Unit',
        surname: 'Test',
        location: 'Brazil',
      },
      usersRepository,
      profilesRepository,
    });
    const { profile } = await sut.execute({ userId: user.id });
    expect(profile).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        userId: user.id,
        name: 'Unit',
        surname: 'Test',
        location: 'Brazil',
        email: 'unitprofile@example.com',
        username: 'unitprofile',
      }),
    );
  });
});
