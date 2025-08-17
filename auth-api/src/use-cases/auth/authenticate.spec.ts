import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { makeUser } from '@/tests/factories/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { BadRequestError } from '../@errors/bad-request-error';
import { AuthenticateUseCase } from './authenticate';

let usersRepository: InMemoryUsersRepository;
let profilesRepository: InMemoryProfilesRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    profilesRepository = new InMemoryProfilesRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it('should be able to authenticate', async () => {
    await makeUser({
      email: 'johndoe@example.com',
      password: '123456',
      usersRepository,
      profilesRepository,
    });

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should be no able to authenticate with wrong email', async () => {
    await expect(
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should be no able to authenticate with wrong password', async () => {
    await makeUser({
      email: 'johndoe@example.com',
      password: '123456',
      usersRepository,
      profilesRepository,
    });

    await expect(
      sut.execute({
        email: 'johndoe@example.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not authenticate deleted user', async () => {
    const { user } = await makeUser({
      email: 'deleted@example.com',
      password: '123456',
      usersRepository,
      profilesRepository,
    });
    // Simula deleção
    user.deletedAt = new Date();
    await expect(
      sut.execute({
        email: 'deleted@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
