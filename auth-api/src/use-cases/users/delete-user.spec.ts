import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { BadRequestError } from '../@errors/bad-request-error';
import { DeleteUserUseCase } from './delete-user';

let usersRepository: InMemoryUsersRepository;
let sut: DeleteUserUseCase;

describe('DeleteUserUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new DeleteUserUseCase(usersRepository);
  });

  it('should delete user by id', async () => {
    const created = await usersRepository.create({
      email: 'deleteuser@example.com',
      password_hash: 'hash',
    });
    await expect(sut.execute({ id: created.id })).resolves.toBeUndefined();
  });

  it('should throw BadRequestError if user not found', async () => {
    await expect(() => sut.execute({ id: 'notfound' })).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
});
