import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { makeUser } from '@/tests/factories/make-user';
import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { BadRequestError } from '../@errors/bad-request-error';
import { ChangeUserPasswordUseCase } from './change-user-password';

describe('ChangeUserPasswordUseCase', () => {
  let usersRepository: InMemoryUsersRepository;
  let profilesRepository: InMemoryProfilesRepository;
  let sut: ChangeUserPasswordUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    profilesRepository = new InMemoryProfilesRepository();
    sut = new ChangeUserPasswordUseCase(usersRepository);
  });

  it('should change user password', async () => {
    const { user } = await makeUser({
      email: 'user@example.com',
      password: 'oldpass',
      usersRepository,
      profilesRepository,
    });
    const result = await sut.execute({ id: user.id, password: 'newpass' });
    const isPasswordHashed = await compare(
      'newpass',
      result.user.password_hash,
    );
    expect(isPasswordHashed).toBe(true);
  });

  it('should throw BadRequestError if user not found', async () => {
    await expect(() =>
      sut.execute({ id: 'notfound', password: 'fail' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not allow password change for deleted user', async () => {
    const { user } = await makeUser({
      email: 'deleted@example.com',
      password: 'oldpass',
      usersRepository,
      profilesRepository,
    });
    user.deletedAt = new Date();
    await expect(() =>
      sut.execute({ id: user.id, password: 'newpass' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
