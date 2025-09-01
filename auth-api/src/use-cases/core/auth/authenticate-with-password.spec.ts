import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { Email } from '@/entities/core/value-objects/email';
import { InMemoryRefreshTokensRepository } from '@/repositories/core/in-memory/in-memory-refresh-tokens-repository';
import { InMemorySessionsRepository } from '@/repositories/core/in-memory/in-memory-sessions-repository';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeUser } from '@/utils/tests/factories/core/make-user';
import { faker } from '@faker-js/faker/locale/en';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthenticateWithPasswordUseCase } from './authenticate-with-password';

let usersRepository: InMemoryUsersRepository;
let sessionsRepository: InMemorySessionsRepository;
let refreshTokensRepository: InMemoryRefreshTokensRepository;

import { UserBlockedError } from '@/@errors/use-cases/user-blocked-error';
import { BLOCK_MINUTES, MAX_ATTEMPTS } from '@/config/auth';
import { CreateSessionUseCase } from '../sessions/create-session';
let createSessionUseCase: CreateSessionUseCase;
let authenticateWithPasswordUseCase: AuthenticateWithPasswordUseCase;
let reply: { jwtSign: () => Promise<string> };

describe('Authenticate With Password Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sessionsRepository = new InMemorySessionsRepository();
    refreshTokensRepository = new InMemoryRefreshTokensRepository();
    reply = {
      jwtSign: async () => faker.internet.jwt(),
    };
    createSessionUseCase = new CreateSessionUseCase(
      sessionsRepository,
      usersRepository,
      refreshTokensRepository,
    );
    authenticateWithPasswordUseCase = new AuthenticateWithPasswordUseCase(
      usersRepository,
      createSessionUseCase,
    );
  });

  it('should authenticate user with correct credentials', async () => {
    await makeUser({
      email: 'johndoe@example.com',
      password: 'Pass@123',
      usersRepository,
    });

    const result = await authenticateWithPasswordUseCase.execute({
      email: 'johndoe@example.com',
      password: 'Pass@123',
      ip: '127.0.0.1',
      reply: reply as unknown as import('fastify').FastifyReply,
    });

    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('johndoe@example.com');

    const allUsers = await usersRepository.listAll();
    expect(allUsers).toHaveLength(1);
  });

  it('should block user after exceeding max failed login attempts', async () => {
    await makeUser({
      email: 'blockme@example.com',
      password: 'Pass@123',
      usersRepository,
    });

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      await expect(
        authenticateWithPasswordUseCase.execute({
          email: 'blockme@example.com',
          password: 'wrongpassword',
          ip: '127.0.0.1',
          reply: reply as unknown as import('fastify').FastifyReply,
        }),
      ).rejects.toSatisfy(
        (error: unknown) =>
          error instanceof BadRequestError || error instanceof UserBlockedError,
      );
    }

    await expect(
      authenticateWithPasswordUseCase.execute({
        email: 'blockme@example.com',
        password: 'Pass@123',
        ip: '127.0.0.1',
        reply: reply as unknown as import('fastify').FastifyReply,
      }),
    ).rejects.toThrow(UserBlockedError);

    try {
      await authenticateWithPasswordUseCase.execute({
        email: 'blockme@example.com',
        password: 'Pass@123',
        ip: '127.0.0.1',
        reply: reply as unknown as import('fastify').FastifyReply,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UserBlockedError);
      expect((error as UserBlockedError).blockedUntil).toBeInstanceOf(Date);
    }
  });

  it('should allow login after block time expires', async () => {
    await makeUser({
      email: 'unlockme@example.com',
      password: 'Pass@123',
      usersRepository,
    });

    vi.useFakeTimers();

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      await expect(
        authenticateWithPasswordUseCase.execute({
          email: 'unlockme@example.com',
          password: 'wrongpassword',
          ip: '127.0.0.1',
          reply: reply as unknown as import('fastify').FastifyReply,
        }),
      ).rejects.toSatisfy(
        (error: unknown) =>
          error instanceof BadRequestError || error instanceof UserBlockedError,
      );
    }

    await expect(
      authenticateWithPasswordUseCase.execute({
        email: 'unlockme@example.com',
        password: 'Pass@123',
        ip: '127.0.0.1',
        reply: reply as unknown as import('fastify').FastifyReply,
      }),
    ).rejects.toThrow(UserBlockedError);

    vi.advanceTimersByTime(BLOCK_MINUTES * 60 * 1000);

    // Agora deve conseguir logar
    const result = await authenticateWithPasswordUseCase.execute({
      email: 'unlockme@example.com',
      password: 'Pass@123',
      ip: '127.0.0.1',
      reply: reply as unknown as import('fastify').FastifyReply,
    });

    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('unlockme@example.com');

    vi.useRealTimers();
  });

  it('should not authenticate user with wrong password', async () => {
    await makeUser({
      email: 'johndoe@example.com',
      password: 'Pass@123',
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
        password: 'Pass@123',
        ip: '127.0.0.1',
        reply: reply as unknown as import('fastify').FastifyReply,
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not authenticate deleted user', async () => {
    await makeUser({
      email: 'deleted@example.com',
      password: 'Pass@123',
      deletedAt: new Date(),
      usersRepository,
    });

    await expect(
      authenticateWithPasswordUseCase.execute({
        email: 'deleted@example.com',
        password: 'Pass@123',
        ip: '127.0.0.1',
        reply: reply as unknown as import('fastify').FastifyReply,
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should update lastLoginAt when authenticating', async () => {
    await makeUser({
      email: 'lastlogin@example.com',
      password: 'Pass@123',
      usersRepository,
    });

    const { user } = await authenticateWithPasswordUseCase.execute({
      email: 'lastlogin@example.com',
      password: 'Pass@123',
      ip: '127.0.0.1',
      reply: reply as unknown as import('fastify').FastifyReply,
    });

    expect(user.lastLoginAt).toBeInstanceOf(Date);
    expect(user.lastLoginAt).not.toBeNull();

    const allUsers = await usersRepository.listAll();
    expect(allUsers).toHaveLength(1);
  });

  it('should not allow invalid email format (Email VO)', () => {
    expect(() => Email.create('invalid-email')).toThrow(BadRequestError);
    expect(() => Email.create('user@invalid')).toThrow(BadRequestError);
    expect(() => Email.create('user@.com')).toThrow(BadRequestError);
    expect(() => Email.create('user@com')).toThrow(BadRequestError);
    expect(() => Email.create('user.com')).toThrow(BadRequestError);
  });
});
