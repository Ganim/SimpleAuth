import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeUser } from '@/utils/tests/factories/core/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteUserByIdUseCase } from './delete-user-by-id';

let usersRepository: InMemoryUsersRepository;
let sut: DeleteUserByIdUseCase;

describe('Delete User By Id Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new DeleteUserByIdUseCase(usersRepository);
  });

  // OBJECTIVE

  it('should soft delete user by id', async () => {
    const { user } = await makeUser({
      email: 'DeleteUserById@example.com',
      password: 'Pass@123',
      usersRepository,
    });

    await expect(sut.execute({ userId: user.id })).resolves.toBeUndefined();

    const userId = new UniqueEntityID(user.id);
    const deletedUser = await usersRepository.findById(userId, true);

    expect(deletedUser?.deletedAt).toBeDefined();

    const items = (usersRepository as InMemoryUsersRepository)['items'];
    const rawUser = items.find((rawUser) => rawUser.id.toString() === user.id);

    expect(rawUser?.deletedAt).toEqual(expect.any(Date));
  });

  // REJECTS

  it('should throw ResourceNotFoundError if user not found', async () => {
    await expect(() =>
      sut.execute({ userId: 'notfound' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not allow deleting an already deleted user', async () => {
    const { user } = await makeUser({
      email: 'alreadydeleted@example.com',
      password: 'Pass@123',
      deletedAt: new Date(),
      usersRepository,
    });

    await expect(sut.execute({ userId: user.id })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });

  // INTEGRATION

  it('should keep correct user count after deletion', async () => {
    await makeUser({
      email: 'user1@example.com',
      password: 'Pass@123',
      usersRepository,
    });
    await makeUser({
      email: 'user2@example.com',
      password: 'Pass@123',
      usersRepository,
    });
    const { user } = await makeUser({
      email: 'user3@example.com',
      password: 'Pass@123',
      usersRepository,
    });

    await expect(sut.execute({ userId: user.id })).resolves.toBeUndefined();
    const allUsers = await usersRepository.listAll();
    expect(allUsers).toHaveLength(2);
    expect(allUsers?.map((user) => user.email.value)).toEqual(
      expect.arrayContaining(['user1@example.com', 'user2@example.com']),
    );
    expect(allUsers?.map((user) => user.email.value)).not.toContain(
      'user3@example.com',
    );
  });
});
