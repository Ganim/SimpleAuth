import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChangeMyProfileUseCase } from './change-my-profile';

let profilesRepository: InMemoryProfilesRepository;
let sut: ChangeMyProfileUseCase;

describe('ChangeMyProfileUseCase', () => {
  beforeEach(() => {
    profilesRepository = new InMemoryProfilesRepository();
    sut = new ChangeMyProfileUseCase(profilesRepository);
  });

  it('should update user profile fields', async () => {
    await profilesRepository.create({
      user: { connect: { id: 'user-id' } },
      name: 'Old',
      surname: 'Name',
      location: 'Brazil',
    });

    const { profile } = await sut.execute({
      userId: 'user-id',
      profile: {
        name: 'NovoNome',
        surname: 'NovoSobrenome',
        location: 'Portugal',
        bio: 'Bio editada',
        avatarUrl: 'url',
      },
    });

    expect(profile.name).toBe('NovoNome');
    expect(profile.surname).toBe('NovoSobrenome');
    expect(profile.location).toBe('Portugal');
    expect(profile.bio).toBe('Bio editada');
    expect(profile.avatarUrl).toBe('url');
  });

  it('should throw BadRequestError if profile does not exist', async () => {
    await expect(() =>
      sut.execute({ userId: 'notfound', profile: { name: 'fail' } }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
