import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeUser } from '@/utils/tests/factories/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChangeUserRoleUseCase } from './change-user-role';

let usersRepository: InMemoryUsersRepository;
let sut: ChangeUserRoleUseCase;

describe('ChangeUserRoleUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ChangeUserRoleUseCase(usersRepository);
  });

  // OBJECTIVE

  it('should change user role', async () => {
    const { user } = await makeUser({
      email: 'user@example.com',
      password: '123456',
      role: 'USER',
      usersRepository,
    });
    const result = await sut.execute({ userId: user.id, role: 'ADMIN' });
    expect(result.user.role).toBe('ADMIN');
  });

  // REJECTS

  it('should not allow role change for deleted user', async () => {
    const { user } = await makeUser({
      email: 'deleted@example.com',
      password: '123456',
      role: 'USER',
      usersRepository,
    });

    const userId = new UniqueEntityID(user.id);
    const storedUser = await usersRepository.findById(userId);

    if (storedUser) storedUser.deletedAt = new Date();

    await expect(() =>
      sut.execute({ userId: user.id, role: 'ADMIN' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should throw ResourceNotFoundError if user not found', async () => {
    await expect(() =>
      sut.execute({ userId: 'notfound', role: 'USER' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
