import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { makeUser } from '@/tests/factories/make-user';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteUserByIdUseCase } from './delete-user-by-id';

let usersRepository: InMemoryUsersRepository;
let profilesRepository: InMemoryProfilesRepository;
let sut: DeleteUserByIdUseCase;

describe('DeleteUserByIdUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    profilesRepository = new InMemoryProfilesRepository();
    sut = new DeleteUserByIdUseCase(usersRepository);
  });

  it('should soft delete user by id', async () => {
    const { user } = await makeUser({
      email: 'DeleteUserById@example.com',
      password: '123456',
      usersRepository,
      profilesRepository,
    });

    await expect(sut.execute({ userId: user.id })).resolves.toBeUndefined();

    const deletedUser = await usersRepository.findById(user.id);

    expect(deletedUser).toBeNull();
    type UserInternal = typeof user & { deletedAt?: Date | null };
    const items: UserInternal[] = (usersRepository as InMemoryUsersRepository)[
      'items'
    ];
    const rawUser = items.find((u) => u.id === user.id);
    expect(rawUser?.deletedAt).toEqual(expect.any(Date));
  });

  it('should throw BadRequestError if user not found', async () => {
    await expect(() =>
      sut.execute({ userId: 'notfound' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
