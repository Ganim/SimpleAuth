import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { InMemorySessionsRepository } from '@/repositories/in-memory/in-memory-sessions-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { makeUser } from '@/tests/factories/make-user';
import { CreateSessionUseCase } from '@/use-cases/sessions/create-session';
import { beforeEach, describe, expect, it } from 'vitest';
import { BadRequestError } from '../@errors/bad-request-error';
import { AuthenticateUseCase } from './authenticate';

let usersRepository: InMemoryUsersRepository;
let profilesRepository: InMemoryProfilesRepository;
let sessionsRepository: InMemorySessionsRepository;
let createSessionUseCase: CreateSessionUseCase;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    profilesRepository = new InMemoryProfilesRepository();
    sessionsRepository = new InMemorySessionsRepository();
    createSessionUseCase = new CreateSessionUseCase(sessionsRepository);
    sut = new AuthenticateUseCase(usersRepository, createSessionUseCase);
  });

  it('should be able to authenticate and create session', async () => {
    await makeUser({
      email: 'johndoe@example.com',
      password: '123456',
      usersRepository,
      profilesRepository,
    });

    const { user, sessionId } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
      ip: '127.0.0.1',
    });

    expect(user.id).toEqual(expect.any(String));
    expect(sessionId).toBeDefined();
    const session = sessionsRepository.items.find((s) => s.id === sessionId);
    expect(session).toBeDefined();
    expect(session?.userId).toBe(user.id);
    expect(session?.ip).toBe('127.0.0.1');
  });

  it('should not authenticate with wrong email', async () => {
    await expect(
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
        ip: '127.0.0.1',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not authenticate with wrong password', async () => {
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
        ip: '127.0.0.1',
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
        ip: '127.0.0.1',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('deve preencher o campo lastLoginAt ao autenticar', async () => {
    await makeUser({
      email: 'lastlogin@example.com',
      password: '123456',
      usersRepository,
      profilesRepository,
    });

    const { user } = await sut.execute({
      email: 'lastlogin@example.com',
      password: '123456',
      ip: '127.0.0.1',
    });

    expect(user.lastLoginAt).toBeInstanceOf(Date);
    expect(user.lastLoginAt).not.toBeNull();
  });
});
