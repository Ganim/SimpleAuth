import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UserRole } from '@/@types/user-role';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeUser } from '@/utils/tests/factories/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { ListAllUserByRoleUseCase } from './list-all-users-by-role';

let usersRepository: InMemoryUsersRepository;
let sut: ListAllUserByRoleUseCase;

describe('List All Users By Role Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ListAllUserByRoleUseCase(usersRepository);
  });

  // OBJECTIVE
  it('should list only users with the specified role USER', async () => {
    await makeUser({
      email: 'user-1@example.com',
      password: 'hash',
      role: 'USER',
      usersRepository,
    });
    await makeUser({
      email: 'manager-1@example.com',
      password: 'hash',
      role: 'MANAGER',
      usersRepository,
    });
    await makeUser({
      email: 'admin-1@example.com',
      password: 'hash',
      role: 'ADMIN',
      usersRepository,
    });

    const { users } = await sut.execute({ role: 'USER' });

    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('user-1@example.com');
    expect(users[0].role).toBe('USER');
  });

  it('should list only users with the specified role MANAGER', async () => {
    await makeUser({
      email: 'user-1@example.com',
      password: 'hash',
      role: 'USER',
      usersRepository,
    });
    await makeUser({
      email: 'manager-1@example.com',
      password: 'hash',
      role: 'MANAGER',
      usersRepository,
    });
    await makeUser({
      email: 'admin-1@example.com',
      password: 'hash',
      role: 'ADMIN',
      usersRepository,
    });

    const { users } = await sut.execute({ role: 'MANAGER' });

    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('manager-1@example.com');
    expect(users[0].role).toBe('MANAGER');
  });

  it('should list only users with the specified role ADMIN', async () => {
    await makeUser({
      email: 'user-1@example.com',
      password: 'hash',
      role: 'USER',
      usersRepository,
    });
    await makeUser({
      email: 'manager-1@example.com',
      password: 'hash',
      role: 'MANAGER',
      usersRepository,
    });
    await makeUser({
      email: 'admin-1@example.com',
      password: 'hash',
      role: 'ADMIN',
      usersRepository,
    });

    const { users } = await sut.execute({ role: 'ADMIN' });

    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('admin-1@example.com');
    expect(users[0].role).toBe('ADMIN');
  });

  // INTEGRATION
  it('should return profile data for each user', async () => {
    await makeUser({
      email: 'manager-2@example.com',
      password: 'hash',
      role: 'MANAGER',
      profile: {
        name: 'Manager Two',
        surname: 'Test',
        birthday: new Date('1990-01-01'),
        location: 'Brazil',
        avatarUrl: 'http://www.example.com/avatar.png',
      },
      usersRepository,
    });

    const { users } = await sut.execute({ role: 'MANAGER' as UserRole });
    expect(users).toHaveLength(1);
    expect(users[0].profile).toBeDefined();
    expect(users[0].profile?.name).toBe('Manager Two');
    expect(users[0].profile?.surname).toBe('Test');
    expect(users[0].profile?.birthday).toEqual(new Date('1990-01-01'));
    expect(users[0].profile?.location).toBe('Brazil');
    expect(users[0].profile?.avatarUrl).toBe(
      'http://www.example.com/avatar.png',
    );
  });

  // VALIDATIONS

  it('should not list users that are soft deleted', async () => {
    const { user } = await makeUser({
      email: 'manager-3@example.com',
      password: 'hash',
      role: 'MANAGER',
      usersRepository,
    });

    const userId = new UniqueEntityID(user.id);
    await usersRepository.delete(userId);

    await expect(
      sut.execute({ role: 'MANAGER' as UserRole }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not list deleted users by role', async () => {
    await makeUser({
      email: 'deleted-manager@example.com',
      password: 'hash',
      role: 'MANAGER',
      usersRepository,
      deletedAt: new Date(),
    });

    await makeUser({
      email: 'active-manager@example.com',
      password: 'hash',
      role: 'MANAGER',
      usersRepository,
    });

    const { users } = await sut.execute({ role: 'MANAGER' });

    expect(users).toHaveLength(1);
    expect(users.map((u) => u.email)).not.toContain(
      'deleted-manager@example.com',
    );
    expect(users.map((u) => u.email)).toContain('active-manager@example.com');
  });
});
