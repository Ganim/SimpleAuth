import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { BadRequestError } from '../@errors/bad-request-error';
import { UpdateMyProfileUseCase } from './update-my-profile';

let profilesRepository: InMemoryProfilesRepository;
let sut: UpdateMyProfileUseCase;

describe('UpdateMyProfileUseCase', () => {
  beforeEach(() => {
    profilesRepository = new InMemoryProfilesRepository();
    sut = new UpdateMyProfileUseCase(profilesRepository);
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
      name: 'NovoNome',
      surname: 'NovoSobrenome',
      location: 'Portugal',
      bio: 'Bio editada',
      avatarUrl: 'url',
    });
    expect(profile.name).toBe('NovoNome');
    expect(profile.surname).toBe('NovoSobrenome');
    expect(profile.location).toBe('Portugal');
    expect(profile.bio).toBe('Bio editada');
    expect(profile.avatarUrl).toBe('url');
  });

  it('should throw BadRequestError if profile does not exist', async () => {
    await expect(() =>
      sut.execute({ userId: 'notfound', name: 'fail' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
