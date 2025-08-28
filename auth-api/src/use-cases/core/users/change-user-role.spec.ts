import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { makeUser } from '@/tests/factories/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChangeUserRoleUseCase } from './change-user-role';

let usersRepository: InMemoryUsersRepository;
let sut: ChangeUserRoleUseCase;

describe('ChangeUserRoleUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ChangeUserRoleUseCase(usersRepository);
  });

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

  it('should throw ResourceNotFoundError if user not found', async () => {
    await expect(() =>
      sut.execute({ userId: 'notfound', role: 'USER' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not allow role change for deleted user', async () => {
    const { user } = await makeUser({
      email: 'deleted@example.com',
      password: '123456',
      role: 'USER',
      usersRepository,
    });
    const storedUser = await usersRepository.findById(user.id);
    if (storedUser) storedUser.deletedAt = new Date();
    await expect(() =>
      sut.execute({ userId: user.id, role: 'ADMIN' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
