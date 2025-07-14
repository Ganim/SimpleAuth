import { env } from '@/env';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { ResourceNotFoundError } from '../@errors/resource-not-found-error';
import { ListAllUserUseCase } from './list-all-users';

let usersRepository: InMemoryUsersRepository;
let sut: ListAllUserUseCase;

describe('List All Users Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ListAllUserUseCase(usersRepository);
  });

  it('should be able to list all users', async () => {
    await usersRepository.create({
      email: 'user-1@example.com',
      password_hash: await hash('123456', env.HASH_ROUNDS),
    });

    await usersRepository.create({
      email: 'user-2@example.com',
      password_hash: await hash('123456', env.HASH_ROUNDS),
    });

    await usersRepository.create({
      email: 'user-3@example.com',
      password_hash: await hash('123456', env.HASH_ROUNDS),
    });

    const { users } = await sut.execute();

    expect(users).toHaveLength(3);
    expect(users[0].email).toBe('user-1@example.com');
    expect(users[1].email).toBe('user-2@example.com');
    expect(users[2].email).toBe('user-3@example.com');
  });

  it('should return resource not found if no users exist', async () => {
    await expect(sut.execute()).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
