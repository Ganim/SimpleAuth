import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeUser } from '@/utils/tests/factories/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChangeUserProfileUseCase } from './change-user-profile';

let usersRepository: InMemoryUsersRepository;
let sut: ChangeUserProfileUseCase;

describe('ChangeUserProfileUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ChangeUserProfileUseCase(usersRepository);
  });

  // OBJECTIVE

  it('should update user profile fields', async () => {
    const { user } = await makeUser({
      email: 'user@example.com',
      password: '123456',
      usersRepository,
    });

    const { user: updatedUser } = await sut.execute({
      userId: user.id,
      profile: {
        name: 'New',
        surname: 'Surname',
        location: 'Portugal',
        bio: 'Bio',
        avatarUrl: 'http://www.example.com',
      },
    });
    expect(updatedUser.profile?.name).toBe('New');
    expect(updatedUser.profile?.surname).toBe('Surname');
    expect(updatedUser.profile?.location).toBe('Portugal');
    expect(updatedUser.profile?.bio).toBe('Bio');
    expect(updatedUser.profile?.avatarUrl).toBe('http://www.example.com');
  });

  // REJECTS

  it('should throw ResourceNotFoundError if profile not found', async () => {
    await expect(() =>
      sut.execute({ userId: 'notfound', profile: { name: 'fail' } }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
