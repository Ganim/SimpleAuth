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

  it('should soft delete user by id', async () => {
    const created = await usersRepository.create({
      email: 'deleteuser@example.com',
      password_hash: 'hash',
    });

    await expect(sut.execute({ id: created.id })).resolves.toBeUndefined();

    const user = await usersRepository.findById(created.id);

    expect(user).toBeNull();
    type UserInternal = typeof created & { deletedAt?: Date | null };
    const items: UserInternal[] = (usersRepository as InMemoryUsersRepository)[
      'items'
    ];
    const rawUser = items.find((u) => u.id === created.id);
    expect(rawUser?.deletedAt).toEqual(expect.any(Date));
  });

  it('should throw BadRequestError if user not found', async () => {
    await expect(() => sut.execute({ id: 'notfound' })).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
});
