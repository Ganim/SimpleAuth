import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { BadRequestError } from '../@errors/bad-request-error';
import { GetUserUseCase } from './get-user';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserUseCase;

describe('GetUserUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserUseCase(usersRepository);
  });

  it('should return user by id', async () => {
    const created = await usersRepository.create({
      email: 'getuser@example.com',
      password_hash: 'hash',
    });
    const { user } = await sut.execute({ id: created.id });
    expect(user.id).toBe(created.id);
    expect(user.email).toBe('getuser@example.com');
  });

  it('should throw BadRequestError if user not found', async () => {
    await expect(() => sut.execute({ id: 'notfound' })).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
});
