import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateProfileUseCase } from './create-profile';

let profilesRepository: InMemoryProfilesRepository;
let sut: CreateProfileUseCase;

describe('Create Profiles Use Case', () => {
  beforeEach(() => {
    profilesRepository = new InMemoryProfilesRepository();
    sut = new CreateProfileUseCase(profilesRepository);
  });

  it('should be able to create an profile', async () => {
    const { profile } = await sut.execute({
      userId: 'id-of-existing-user',
    });

    expect(profile.id).toEqual(expect.any(String));
    expect(profile.userId).toEqual('id-of-existing-user');
  });
});
