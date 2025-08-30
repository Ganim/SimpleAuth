import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { Email } from '@/entities/core/value-objects/email';
import { InMemorySessionsRepository } from '@/repositories/core/in-memory/in-memory-sessions-repository';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeUser } from '@/utils/tests/factories/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthenticateWithPasswordUseCase } from './authenticate-with-password';

let usersRepository: InMemoryUsersRepository;
let sessionsRepository: InMemorySessionsRepository;

import { CreateSessionUseCase } from '../sessions/create-session';
let createSessionUseCase: CreateSessionUseCase;
let authenticateWithPasswordUseCase: AuthenticateWithPasswordUseCase;
let reply: { jwtSign: () => Promise<string> };

describe('Authenticate With Password Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sessionsRepository = new InMemorySessionsRepository();
    reply = {
      jwtSign: async () => 'fake-token',
    };
    createSessionUseCase = new CreateSessionUseCase(
      sessionsRepository,
      usersRepository,
    );
    authenticateWithPasswordUseCase = new AuthenticateWithPasswordUseCase(
      usersRepository,
      createSessionUseCase,
    );
  });

  it('should authenticate user with correct credentials', async () => {
    await makeUser({
      email: 'johndoe@example.com',
      password: '123456',
      usersRepository,
    });

    const result = await authenticateWithPasswordUseCase.execute({
      email: 'johndoe@example.com',
      password: '123456',
      ip: '127.0.0.1',
      reply: reply as unknown as import('fastify').FastifyReply,
    });

    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('johndoe@example.com');
    expect(result.token).toBe('fake-token');
    expect(result.refreshToken).toBe('fake-token');

    const allUsers = await usersRepository.listAll();
    expect(allUsers).toHaveLength(1);
  });

  it('should not authenticate user with wrong password', async () => {
    await makeUser({
      email: 'johndoe@example.com',
      password: '123456',
      usersRepository,
    });

    await expect(
      authenticateWithPasswordUseCase.execute({
        email: 'johndoe@example.com',
        password: 'wrongpassword',
        ip: '127.0.0.1',
        reply: reply as unknown as import('fastify').FastifyReply,
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not authenticate non-existent user', async () => {
    await expect(
      authenticateWithPasswordUseCase.execute({
        email: 'notfound@example.com',
        password: '123456',
        ip: '127.0.0.1',
        reply: reply as unknown as import('fastify').FastifyReply,
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not authenticate deleted user', async () => {
    await makeUser({
      email: 'deleted@example.com',
      password: '123456',
      deletedAt: new Date(),
      usersRepository,
    });

    await expect(
      authenticateWithPasswordUseCase.execute({
        email: 'deleted@example.com',
        password: '123456',
        ip: '127.0.0.1',
        reply: reply as unknown as import('fastify').FastifyReply,
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should update lastLoginAt when authenticating', async () => {
    await makeUser({
      email: 'lastlogin@example.com',
      password: '123456',
      usersRepository,
    });

    const { user } = await authenticateWithPasswordUseCase.execute({
      email: 'lastlogin@example.com',
      password: '123456',
      ip: '127.0.0.1',
      reply: reply as unknown as import('fastify').FastifyReply,
    });

    expect(user.lastLoginAt).toBeInstanceOf(Date);
    expect(user.lastLoginAt).not.toBeNull();

    const allUsers = await usersRepository.listAll();
    expect(allUsers).toHaveLength(1);
  });

  it('should not allow invalid email format (Email VO)', () => {
    expect(() => new Email('invalid-email')).toThrow(BadRequestError);
    expect(() => new Email('user@invalid')).toThrow(BadRequestError);
    expect(() => new Email('user@.com')).toThrow(BadRequestError);
    expect(() => new Email('user@com')).toThrow(BadRequestError);
    expect(() => new Email('user.com')).toThrow(BadRequestError);
  });
});
