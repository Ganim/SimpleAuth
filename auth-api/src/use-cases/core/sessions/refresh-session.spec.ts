import { IpAddress } from '@/entities/core/value-objects/ip-address';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { InMemoryRefreshTokensRepository } from '@/repositories/core/in-memory/in-memory-refresh-tokens-repository';
import { InMemorySessionsRepository } from '@/repositories/core/in-memory/in-memory-sessions-repository';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeRefreshToken } from '@/utils/tests/factories/core/make-refresh-token';
import { makeSession } from '@/utils/tests/factories/core/make-session';
import { makeUser } from '@/utils/tests/factories/core/make-user';
import type { FastifyReply } from 'fastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RefreshSessionUseCase } from './refresh-session';

let sessionsRepository: InMemorySessionsRepository;
let usersRepository: InMemoryUsersRepository;
let refreshTokensRepository: InMemoryRefreshTokensRepository;
let sut: RefreshSessionUseCase;
let reply: FastifyReply;

describe('RefreshSessionUseCase', () => {
  beforeEach(() => {
    sessionsRepository = new InMemorySessionsRepository();
    usersRepository = new InMemoryUsersRepository();
    refreshTokensRepository = new InMemoryRefreshTokensRepository();
    sut = new RefreshSessionUseCase(
      sessionsRepository,
      usersRepository,
      refreshTokensRepository,
    );
    const jwtSignMock = vi.fn().mockResolvedValue('new-refresh-token');
    reply = { jwtSign: jwtSignMock } as unknown as FastifyReply;
  });

  // OBJECTIVE

  it('should refresh a session and return new session and refresh token', async () => {
    const { user } = await makeUser({
      email: 'user@example.com',
      password: 'password123',
      usersRepository,
    });

    const { session } = await makeSession({
      userId: user.id,
      ip: '1.2.3.4',
      sessionsRepository,
      usersRepository,
      reply,
    });

    const token = await reply.jwtSign(
      { sessionId: session.id, userId: user.id },
      { sign: { sub: user.id, expiresIn: '7d' } },
    );
    await makeRefreshToken({
      userId: user.id,
      sessionId: session.id,
      token,
      expiresAt: new Date(Date.now() + 1000),
      refreshTokensRepository,
    });

    const result = await sut.execute({
      sessionId: session.id,
      userId: user.id,
      ip: '5.6.7.8',
      reply,
    });

    expect(result.session.id).toBe(session.id);
    expect(result.session.ip).toBe('5.6.7.8');
    expect(result.refreshToken.token).toBe('new-refresh-token');
  });

  // REJECTS

  it('should throw if user is not found', async () => {
    const session = await sessionsRepository.create({
      userId: new UniqueEntityID('user-x'),
      ip: new IpAddress('1.1.1.1'),
    });

    const token = await reply.jwtSign(
      { sessionId: session.id.toString(), userId: 'user-x' },
      { sign: { sub: 'user-x', expiresIn: '7d' } },
    );
    await makeRefreshToken({
      userId: 'user-x',
      sessionId: session.id.toString(),
      token,
      expiresAt: new Date(Date.now() + 1000),
      refreshTokensRepository,
    });

    await expect(
      sut.execute({
        sessionId: session.id.toString(),
        userId: 'non-existent-user',
        ip: '1.1.1.1',
        reply,
      }),
    ).rejects.toThrow();
  });

  it('should throw if session is not found', async () => {
    const { user } = await makeUser({
      email: 'user2@example.com',
      password: 'password123',
      usersRepository,
    });

    await expect(
      sut.execute({
        sessionId: 'non-existent-session',
        userId: user.id,
        ip: '1.1.1.1',
        reply,
      }),
    ).rejects.toThrow();
  });

  it('should throw if refresh token is not found', async () => {
    const { user } = await makeUser({
      email: 'user3@example.com',
      password: 'password123',
      usersRepository,
    });

    const { session } = await makeSession({
      userId: user.id,
      ip: '1.1.1.1',
      sessionsRepository,
      usersRepository,
      reply,
    });

    await expect(
      sut.execute({
        sessionId: session.id,
        userId: user.id,
        ip: '1.1.1.1',
        reply,
      }),
    ).rejects.toThrow();
  });

  // VALIDATIONS

  it('should throw if sessionId is invalid', async () => {
    await expect(
      sut.execute({
        sessionId: 'invalid-session-id',
        userId: 'user-1',
        ip: '1.1.1.1',
        reply,
      }),
    ).rejects.toThrow();
  });

  it('should throw if userId is invalid', async () => {
    await expect(
      sut.execute({
        sessionId: 'session-1',
        userId: 'invalid-user-id',
        ip: '1.1.1.1',
        reply,
      }),
    ).rejects.toThrow();
  });

  it('should throw if IP address is invalid', async () => {
    await expect(
      sut.execute({
        sessionId: 'session-1',
        userId: 'user-1',
        ip: 'invalid-ip',
        reply,
      }),
    ).rejects.toThrow();
  });

  // EDGE CASES

  it('should allow refreshing session with same IP', async () => {
    const { user } = await makeUser({
      email: 'user4@example.com',
      password: 'password123',
      usersRepository,
    });

    const { session } = await makeSession({
      userId: user.id,
      ip: '9.9.9.9',
      sessionsRepository,
      usersRepository,
      reply,
    });

    const tokenEdge = await reply.jwtSign(
      { sessionId: session.id, userId: user.id },
      { sign: { sub: user.id, expiresIn: '7d' } },
    );
    await makeRefreshToken({
      userId: user.id,
      sessionId: session.id,
      token: tokenEdge,
      expiresAt: new Date(Date.now() + 1000),
      refreshTokensRepository,
    });

    const result = await sut.execute({
      sessionId: session.id,
      userId: user.id,
      ip: '9.9.9.9',
      reply,
    });

    expect(result.session.ip).toBe('9.9.9.9');
  });

  it('should create a new refresh token with 7 days expiration', async () => {
    const { user } = await makeUser({
      email: 'user5@example.com',
      password: 'password123',
      usersRepository,
    });

    const { session } = await makeSession({
      userId: user.id,
      ip: '8.8.8.8',
      sessionsRepository,
      usersRepository,
      reply,
    });

    const tokenExp = await reply.jwtSign(
      { sessionId: session.id, userId: user.id },
      { sign: { sub: user.id, expiresIn: '7d' } },
    );
    await makeRefreshToken({
      userId: user.id,
      sessionId: session.id,
      token: tokenExp,
      expiresAt: new Date(Date.now() + 1000),
      refreshTokensRepository,
    });

    const result = await sut.execute({
      sessionId: session.id,
      userId: user.id,
      ip: '8.8.8.8',
      reply,
    });

    const expiresAt = result.refreshToken.expiresAt;
    expect(expiresAt).toBeInstanceOf(Date);
    expect(expiresAt.getTime()).toBeGreaterThan(
      Date.now() + 6 * 24 * 60 * 60 * 1000,
    );
  });
});
