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
    const { createdProfile } = await sut.execute({
      userId: 'id-of-existing-user',
    });

    expect(createdProfile.id).toEqual(expect.any(String));
    expect(createdProfile.userId).toEqual('id-of-existing-user');
  });

  it('should be able to create an profile with name and surname', async () => {
    const { createdProfile } = await sut.execute({
      userId: 'id-of-existing-user',
      profile: {
        name: 'John',
        surname: 'Doe',
      },
    });

    expect(createdProfile.id).toEqual(expect.any(String));
    expect(createdProfile.userId).toEqual('id-of-existing-user');
    expect(createdProfile.name).toEqual('John');
    expect(createdProfile.surname).toEqual('Doe');
  });
});
