import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { makeUser } from '@/tests/factories/make-user';
import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChangeMyPasswordUseCase } from './change-my-password';

let usersRepository: InMemoryUsersRepository;
let sut: ChangeMyPasswordUseCase;

describe('Change My Password Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ChangeMyPasswordUseCase(usersRepository);
  });

  it('should change own password', async () => {
    const { user } = await makeUser({
      email: 'user@example.com',
      password: 'oldpass',
      usersRepository,
    });
    await sut.execute({ userId: user.id, password: 'newpass' });

    const updatedUser = await usersRepository.findById(user.id);
    expect(updatedUser).toBeDefined();

    const isPasswordHashed = await compare(
      'newpass',
      updatedUser!.passwordHash,
    );
    expect(isPasswordHashed).toBe(true);

    const allUsers = await usersRepository.listAll();
    expect(allUsers).toHaveLength(1);
  });

  it('should throw ResourceNotFoundError if user does not exist', async () => {
    await expect(
      sut.execute({ userId: 'notfound', password: 'fail' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should throw ResourceNotFoundError if user is deleted', async () => {
    const { user } = await makeUser({
      email: 'deleted@example.com',
      password: '123456',
      deletedAt: new Date(),
      usersRepository,
    });
    await expect(
      sut.execute({ userId: user.id, password: 'fail' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should keep correct user count after password change', async () => {
    await makeUser({
      email: 'user1@example.com',
      password: '123456',
      usersRepository,
    });
    const { user } = await makeUser({
      email: 'user2@example.com',
      password: '123456',
      usersRepository,
    });
    await sut.execute({ userId: user.id, password: 'changedpass' });
    const allUsers = await usersRepository.listAll();
    expect(allUsers).toHaveLength(2);
  });
});
