import type { UserRole } from '@/@types/user-role';
import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { makeUser } from '@/tests/factories/make-user';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found';
import { beforeEach, describe, expect, it } from 'vitest';
import { ListAllUserByRoleUseCase } from './list-all-users-by-role';

let usersRepository: InMemoryUsersRepository;
let profilesRepository: InMemoryProfilesRepository;
let sut: ListAllUserByRoleUseCase;

describe('List All Users By Role Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    profilesRepository = new InMemoryProfilesRepository();
    sut = new ListAllUserByRoleUseCase(usersRepository, profilesRepository);
  });

  it('should list only users with the specified role MANAGER', async () => {
    await makeUser({
      email: 'user-1@example.com',
      password: 'hash',
      role: 'USER',
      usersRepository,
      profilesRepository,
    });
    await makeUser({
      email: 'manager-1@example.com',
      password: 'hash',
      role: 'MANAGER',
      usersRepository,
      profilesRepository,
    });
    await makeUser({
      email: 'admin-1@example.com',
      password: 'hash',
      role: 'ADMIN',
      usersRepository,
      profilesRepository,
    });

    const { users } = await sut.execute({ role: 'MANAGER' });

    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('manager-1@example.com');
    expect(users[0].role).toBe('MANAGER');
  });

  it('should return profile data for each user', async () => {
    const { makeUser } = await import('@/tests/factories/make-user');
    await makeUser({
      email: 'manager-2@example.com',
      password: 'hash',
      role: 'MANAGER',
      profile: {
        name: 'Manager Two',
        surname: 'Test',
        birthday: new Date('1990-01-01'),
        location: 'Brazil',
        avatarUrl: 'avatar.png',
      },
      usersRepository,
      profilesRepository,
    });

    const { users } = await sut.execute({ role: 'MANAGER' as UserRole });
    expect(users).toHaveLength(1);
    expect(users[0].profile).toBeDefined();
    expect(users[0].profile?.name).toBe('Manager Two');
    expect(users[0].profile?.surname).toBe('Test');
    expect(users[0].profile?.birthday).toEqual(new Date('1990-01-01'));
    expect(users[0].profile?.location).toBe('Brazil');
    expect(users[0].profile?.avatarUrl).toBe('avatar.png');
  });

  it('should not list users that are soft deleted', async () => {
    const { makeUser } = await import('@/tests/factories/make-user');
    const { user } = await makeUser({
      email: 'manager-3@example.com',
      password: 'hash',
      role: 'MANAGER',
      usersRepository,
      profilesRepository,
    });
    await usersRepository.delete(user.id);

    await expect(
      sut.execute({ role: 'MANAGER' as UserRole }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not list deleted users by role', async () => {
    const { user: deletedUser } = await makeUser({
      email: 'deleted-manager@example.com',
      password: 'hash',
      role: 'MANAGER',
      usersRepository,
      profilesRepository,
    });
    deletedUser.deletedAt = new Date();
    await makeUser({
      email: 'active-manager@example.com',
      password: 'hash',
      role: 'MANAGER',
      usersRepository,
      profilesRepository,
    });
    const { users } = await sut.execute({ role: 'MANAGER' });
    expect(users.map((u) => u.email)).not.toContain(
      'deleted-manager@example.com',
    );
    expect(users.map((u) => u.email)).toContain('active-manager@example.com');
  });
});
