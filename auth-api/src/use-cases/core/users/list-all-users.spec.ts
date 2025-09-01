import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeUser } from '@/utils/tests/factories/core/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { ListAllUserUseCase } from './list-all-users';

let usersRepository: InMemoryUsersRepository;
let sut: ListAllUserUseCase;

describe('List All Users Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ListAllUserUseCase(usersRepository);
  });

  // OBJECTIVE

  it('should list all active users', async () => {
    await makeUser({
      email: 'user-1@example.com',
      password: 'Pass@123',
      profile: { name: 'User One' },
      usersRepository,
    });
    await makeUser({
      email: 'user-2@example.com',
      password: 'Pass@123',
      profile: { name: 'User Two' },
      usersRepository,
    });
    await makeUser({
      email: 'user-3@example.com',
      password: 'Pass@123',
      profile: { name: 'User Three' },
      usersRepository,
    });

    const { users } = await sut.execute();

    expect(users).toHaveLength(3);
    expect(users[0].email).toBe('user-1@example.com');
    expect(users[1].email).toBe('user-2@example.com');
    expect(users[2].email).toBe('user-3@example.com');

    users.forEach((user, idx) => {
      expect(user.profile).toBeDefined();
      expect(user.profile?.name).toBe(`User ${['One', 'Two', 'Three'][idx]}`);
    });
  });

  // VALIDATIONS

  it('should return error if there are no users', async () => {
    await expect(sut.execute()).rejects.toBeInstanceOf(ResourceNotFoundError);
    await expect(sut.execute()).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not list deleted users (deletedAt filled)', async () => {
    await makeUser({
      email: 'deleted@example.com',
      password: 'Pass@123',
      profile: { name: 'Deleted User' },
      deletedAt: new Date(),
      usersRepository,
    });

    await makeUser({
      email: 'active@example.com',
      password: 'Pass@123',
      profile: { name: 'Active User' },
      usersRepository,
    });

    const { users } = await sut.execute();
    expect(users).toHaveLength(1);
    expect(users.map((u) => u.email)).not.toContain('deleted@example.com');
    expect(users.map((u) => u.email)).toContain('active@example.com');
  });
});
