import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { makeUser } from '@/tests/factories/make-user';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found';
import { beforeEach, describe, expect, it } from 'vitest';
import { ListAllUserUseCase } from './list-all-users';

let usersRepository: InMemoryUsersRepository;
let profilesRepository: InMemoryProfilesRepository;
let sut: ListAllUserUseCase;

describe('List All Users Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    profilesRepository = new InMemoryProfilesRepository();
    sut = new ListAllUserUseCase(usersRepository, profilesRepository);
  });

  it('should be able to list all users', async () => {
    await makeUser({
      email: 'user-1@example.com',
      password: '123456',
      profile: { name: 'User One' },
      usersRepository,
      profilesRepository,
    });
    await makeUser({
      email: 'user-2@example.com',
      password: '123456',
      profile: { name: 'User Two' },
      usersRepository,
      profilesRepository,
    });
    await makeUser({
      email: 'user-3@example.com',
      password: '123456',
      profile: { name: 'User Three' },
      usersRepository,
      profilesRepository,
    });

    const { users } = await sut.execute();

    expect(users).toHaveLength(3);
    expect(users[0].email).toBe('user-1@example.com');
    expect(users[1].email).toBe('user-2@example.com');
    expect(users[2].email).toBe('user-3@example.com');
    // Verifica dados do perfil
    users.forEach((user, idx) => {
      expect(user.profile).toBeDefined();
      expect(user.profile?.name).toBe(`User ${['One', 'Two', 'Three'][idx]}`);
    });
  });

  it('should not list users that are soft deleted', async () => {
    const { user: userToBeDeleted } = await makeUser({
      email: 'user-1@example.com',
      password: '123456',
      profile: { name: 'User One' },
      usersRepository,
      profilesRepository,
    });
    await makeUser({
      email: 'user-2@example.com',
      password: '123456',
      profile: { name: 'User Two' },
      usersRepository,
      profilesRepository,
    });
    await makeUser({
      email: 'user-3@example.com',
      password: '123456',
      profile: { name: 'User Three' },
      usersRepository,
      profilesRepository,
    });

    await usersRepository.delete(userToBeDeleted.id);

    const { users } = await sut.execute();

    expect(users).toHaveLength(2);
    expect(users.map((user) => user.email)).toEqual(
      expect.arrayContaining(['user-2@example.com', 'user-3@example.com']),
    );
    expect(users.map((user) => user.email)).not.toContain('user-1@example.com');
  });

  it('should not list deleted users', async () => {
    const { user: deletedUser } = await makeUser({
      email: 'deleted@example.com',
      password: '123456',
      profile: { name: 'Deleted User' },
      usersRepository,
      profilesRepository,
    });
    deletedUser.deletedAt = new Date();
    await makeUser({
      email: 'active@example.com',
      password: '123456',
      profile: { name: 'Active User' },
      usersRepository,
      profilesRepository,
    });
    const { users } = await sut.execute();
    expect(users.map((u) => u.email)).not.toContain('deleted@example.com');
    expect(users.map((u) => u.email)).toContain('active@example.com');
  });

  it('should return resource not found if no users exist', async () => {
    await expect(sut.execute()).rejects.toBeInstanceOf(ResourceNotFoundError);
    await expect(sut.execute()).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
