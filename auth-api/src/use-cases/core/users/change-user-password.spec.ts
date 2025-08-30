import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeUser } from '@/utils/tests/factories/make-user';
import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChangeUserPasswordUseCase } from './change-user-password';

let usersRepository: InMemoryUsersRepository;
let sut: ChangeUserPasswordUseCase;

describe('ChangeUserPasswordUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ChangeUserPasswordUseCase(usersRepository);
  });

  it('should change user password', async () => {
    const { user } = await makeUser({
      email: 'user@example.com',
      password: 'oldpass',
      usersRepository,
    });
    await sut.execute({ userId: user.id, password: 'newpass' });

    const updatedUser = await usersRepository.findById(user.id);
    const isPasswordHashed = await compare(
      'newpass',
      updatedUser?.passwordHash ?? '',
    );
    expect(isPasswordHashed).toBe(true);
  });

  it('should throw ResourceNotFoundError if user not found', async () => {
    await expect(() =>
      sut.execute({ userId: 'notfound', password: 'fail' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not allow password change for deleted user', async () => {
    const { user } = await makeUser({
      email: 'deleted@example.com',
      password: 'oldpass',
      usersRepository,
    });
    const storedUser = await usersRepository.findById(user.id);
    if (storedUser) storedUser.deletedAt = new Date();
    await expect(() =>
      sut.execute({ userId: user.id, password: 'newpass' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
