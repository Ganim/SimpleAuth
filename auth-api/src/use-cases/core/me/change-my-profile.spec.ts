import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeUser } from '@/utils/tests/factories/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChangeMyProfileUseCase } from './change-my-profile';

let usersRepository: InMemoryUsersRepository;
let sut: ChangeMyProfileUseCase;

describe('Change My Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ChangeMyProfileUseCase(usersRepository);
  });

  it('should update user profile fields', async () => {
    const { user } = await makeUser({
      email: 'user@example.com',
      password: '123456',
      usersRepository,
    });

    const result = await sut.execute({
      userId: user.id,
      profile: {
        name: 'NewName',
        surname: 'NewSurname',
        location: 'Portugal',
        bio: 'Edited bio',
        avatarUrl: 'new-url',
      },
    });

    expect(result.user.profile?.name).toBe('NewName');
    expect(result.user.profile?.surname).toBe('NewSurname');
    expect(result.user.profile?.location).toBe('Portugal');
    expect(result.user.profile?.bio).toBe('Edited bio');
    expect(result.user.profile?.avatarUrl).toBe('new-url');

    const allUsers = await usersRepository.listAll();
    expect(allUsers).toHaveLength(1);
  });

  it('should throw ResourceNotFoundError if user does not exist', async () => {
    await expect(
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
    await expect(
      sut.execute({ userId: user.id, profile: { name: 'fail' } }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

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
