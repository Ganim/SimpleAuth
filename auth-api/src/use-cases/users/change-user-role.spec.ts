import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { makeUser } from '@/tests/factories/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { BadRequestError } from '../@errors/bad-request-error';
import { ChangeUserRoleUseCase } from './change-user-role';

describe('ChangeUserRoleUseCase', () => {
  let usersRepository: InMemoryUsersRepository;
  let profilesRepository: InMemoryProfilesRepository;
  let sut: ChangeUserRoleUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    profilesRepository = new InMemoryProfilesRepository();
    sut = new ChangeUserRoleUseCase(usersRepository);
  });

  it('should change user role', async () => {
    const { user } = await makeUser({
      email: 'user@example.com',
      password: '123456',
      role: 'USER',
      usersRepository,
      profilesRepository,
    });
    const result = await sut.execute({ id: user.id, role: 'ADMIN' });
    expect(result.user.role).toBe('ADMIN');
  });

  it('should throw BadRequestError if user not found', async () => {
    await expect(() =>
      sut.execute({ id: 'notfound', role: 'USER' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
