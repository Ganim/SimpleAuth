import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
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

  // OBJECTIVE
  it('should change user password', async () => {
    const { user } = await makeUser({
      email: 'user@example.com',
      password: 'oldpass',
      usersRepository,
    });
    await sut.execute({ userId: user.id, password: 'newpass' });

    const userId = new UniqueEntityID(user.id);
    const updatedUser = await usersRepository.findById(userId);

    const isPasswordHashed = await compare(
      'newpass',
      updatedUser?.password.toString() ?? '',
    );
    expect(isPasswordHashed).toBe(true);
  });

  // REJECTS

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
    const userId = new UniqueEntityID(user.id);
    const storedUser = await usersRepository.findById(userId);
    if (storedUser) storedUser.deletedAt = new Date();
    await expect(() =>
      sut.execute({ userId: user.id, password: 'newpass' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
