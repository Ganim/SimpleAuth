import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { ResourceNotFoundError } from '../@errors/resource-not-found-error';
import { GetProfileUseCase } from './get-profile';

let profileRepository: InMemoryProfilesRepository;
let sut: GetProfileUseCase;

describe('Get user profile Use Case', () => {
  beforeEach(() => {
    profileRepository = new InMemoryProfilesRepository();
    sut = new GetProfileUseCase(profileRepository);
  });

  it('should be able to get user profile', async () => {
    const createdProfile = await profileRepository.create('user-id-1');

    const { profile } = await sut.execute({
      userId: createdProfile.userId,
    });

    expect(profile.id).toEqual(expect.any(String));
    expect(profile.userId).toEqual('user-id-1');
  });

  it('should be no able to get user profile with wrong id', async () => {
    await expect(
      sut.execute({
        userId: 'user-id-that-does-not-exist',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
