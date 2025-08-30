import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeUser } from '@/utils/tests/factories/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChangeMyProfileUseCase } from './change-my-profile';

let usersRepository: InMemoryUsersRepository;
let sut: ChangeMyProfileUseCase;

describe('ChangeMyProfileUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ChangeMyProfileUseCase(usersRepository);
  });

  // OBJECTIVE

  it('should update own profile fields', async () => {
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

  it('should throw ResourceNotFoundError if user does not exist', async () => {
    await expect(() =>
      sut.execute({ userId: 'notfound', profile: { name: 'fail' } }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should throw ResourceNotFoundError if user is deleted', async () => {
    const { user } = await makeUser({
      email: 'deleted@example.com',
      password: '123456',
      deletedAt: new Date(),
      usersRepository,
    });
    await expect(() =>
      sut.execute({ userId: user.id, profile: { name: 'fail' } }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  // INTEGRATION

  it('should keep correct user count after profile change', async () => {
    await makeUser({
      email: 'user1@example.com',
      password: '123456',
      usersRepository,
    });
    const { user } = await makeUser({
      email: 'user2@example.com',
      password: '123456',
      usersRepository,
    });
    await sut.execute({
      userId: user.id,
      profile: { name: 'ChangedName' },
    });
    const allUsers = await usersRepository.listAll();
    expect(allUsers).toHaveLength(2);
  });
});
