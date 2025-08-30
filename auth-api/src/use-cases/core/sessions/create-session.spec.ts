import { InMemorySessionsRepository } from '@/repositories/core/in-memory/in-memory-sessions-repository';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeUser } from '@/utils/tests/factories/make-user';
import type { FastifyReply } from 'fastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateSessionUseCase } from './create-session';

let sessionsRepository: InMemorySessionsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: CreateSessionUseCase;
let reply: FastifyReply;

describe('CreateSessionUseCase', () => {
  beforeEach(() => {
    sessionsRepository = new InMemorySessionsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new CreateSessionUseCase(sessionsRepository, usersRepository);
    const jwtSignMock = vi.fn().mockResolvedValue('mocked-token');
    reply = { jwtSign: jwtSignMock } as unknown as FastifyReply;
  });

  // OBJECTIVE

  it('should create a valid session', async () => {
    const { user } = await makeUser({
      email: 'user1@example.com',
      password: 'password123',
      usersRepository,
    });

    const { session, token, refreshToken } = await sut.execute({
      userId: user.id,
      ip: '127.0.0.1',
      reply,
    });

    expect(session.id).toBeDefined();
    expect(session.userId).toBe(user.id);
    expect(session.ip).toBe('127.0.0.1');
    expect(session.createdAt).toBeInstanceOf(Date);
    expect(session.expiredAt).toBeNull();
    expect(session.revokedAt).toBeNull();
    expect(token).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  // REJECTS

  it('should not create a session if user is not found', async () => {
    await expect(
      sut.execute({
        userId: 'non-existent-user',
        ip: '127.0.0.1',
        reply,
      }),
    ).rejects.toThrow();
  });

  it('should not create a session if user is soft deleted', async () => {
    const { user } = await makeUser({
      email: 'deleted@example.com',
      password: 'password123',
      deletedAt: new Date(),
      usersRepository,
    });

    await expect(
      sut.execute({
        userId: user.id,
        ip: '127.0.0.1',
        reply,
      }),
    ).rejects.toThrow();
  });

  // VALIDATIONS

  it('should not create a session with invalid userId', async () => {
    await expect(
      sut.execute({
        userId: 'invalid-user',
        ip: '127.0.0.1',
        reply,
      }),
    ).rejects.toThrow();
  });

  it('should not create a session with invalid IP address', async () => {
    await expect(
      sut.execute({
        userId: 'user-1',
        ip: 'invalid-ip',
        reply,
      }),
    ).rejects.toThrow();
  });

  // EDGE CASES

  it('should handle multiple session creations for the same user', async () => {
    const { user } = await makeUser({
      email: 'user1@example.com',
      password: 'password123',
      usersRepository,
    });

    const {
      session: session1,
      token: token1,
      refreshToken: refreshToken1,
    } = await sut.execute({
      userId: user.id,
      ip: '127.0.0.1',
      reply,
    });

    const {
      session: session2,
      token: token2,
      refreshToken: refreshToken2,
    } = await sut.execute({
      userId: user.id,
      ip: '127.0.0.2',
      reply,
    });

    expect(session1.id).toBeDefined();
    expect(session1.userId).toBe(user.id);
    expect(session1.ip).toBe('127.0.0.1');
    expect(session1.createdAt).toBeInstanceOf(Date);
    expect(session1.expiredAt).toBeNull();
    expect(session1.revokedAt).toBeNull();
    expect(token1).toBeDefined();
    expect(refreshToken1).toBeDefined();

    expect(session2.id).toBeDefined();
    expect(session2.userId).toBe(user.id);
    expect(session2.ip).toBe('127.0.0.2');
    expect(session2.createdAt).toBeInstanceOf(Date);
    expect(session2.expiredAt).toBeNull();
    expect(session2.revokedAt).toBeNull();
    expect(token2).toBeDefined();
    expect(refreshToken2).toBeDefined();
  });
});
