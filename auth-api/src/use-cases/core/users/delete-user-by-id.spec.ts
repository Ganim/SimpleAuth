import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { makeUser } from '@/tests/factories/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteUserByIdUseCase } from './delete-user-by-id';

let usersRepository: InMemoryUsersRepository;
let sut: DeleteUserByIdUseCase;

describe('Delete User By Id Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new DeleteUserByIdUseCase(usersRepository);
  });

  it('should soft delete user by id', async () => {
    const { user } = await makeUser({
      email: 'DeleteUserById@example.com',
      password: '123456',
      usersRepository,
    });

    await expect(sut.execute({ userId: user.id })).resolves.toBeUndefined();

    const deletedUser = await usersRepository.findById(user.id);

    expect(deletedUser).toBeNull();
    const items = (usersRepository as InMemoryUsersRepository)['items'];
    const rawUser = items.find((u) => u.id.toString() === user.id);
    expect(rawUser?.deletedAt).toEqual(expect.any(Date));
  });

  it('should throw ResourceNotFoundError if user not found', async () => {
    await expect(() =>
      sut.execute({ userId: 'notfound' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not allow deleting an already deleted user', async () => {
    const { user } = await makeUser({
      email: 'alreadydeleted@example.com',
      password: '123456',
      deletedAt: new Date(),
      usersRepository,
    });

    await expect(sut.execute({ userId: user.id })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });

  it('should keep correct user count after deletion', async () => {
    await makeUser({
      email: 'user1@example.com',
      password: '123456',
      usersRepository,
    });
    await makeUser({
      email: 'user2@example.com',
      password: '123456',
      usersRepository,
    });
    const { user } = await makeUser({
      email: 'user3@example.com',
      password: '123456',
      usersRepository,
    });

    await expect(sut.execute({ userId: user.id })).resolves.toBeUndefined();
    const allUsers = await usersRepository.listAll();
    expect(allUsers).toHaveLength(2);
    expect(allUsers.map((u) => u.email)).toEqual(
      expect.arrayContaining(['user1@example.com', 'user2@example.com']),
    );
    expect(allUsers.map((u) => u.email)).not.toContain('user3@example.com');
  });
});
