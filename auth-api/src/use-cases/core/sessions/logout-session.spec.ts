import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { InMemoryRefreshTokensRepository } from '@/repositories/core/in-memory/in-memory-refresh-tokens-repository';
import { InMemorySessionsRepository } from '@/repositories/core/in-memory/in-memory-sessions-repository';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeRefreshToken } from '@/utils/tests/factories/make-refresh-token';
import { makeSession } from '@/utils/tests/factories/make-session';
import { makeUser } from '@/utils/tests/factories/make-user';
import type { FastifyReply } from 'fastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LogoutSessionUseCase } from './logout-session';

let sessionsRepository: InMemorySessionsRepository;
let usersRepository: InMemoryUsersRepository;
let refreshTokensRepository: InMemoryRefreshTokensRepository;
let sut: LogoutSessionUseCase;
let reply: FastifyReply;

describe('LogoutSessionUseCase', () => {
  beforeEach(() => {
    sessionsRepository = new InMemorySessionsRepository();
    usersRepository = new InMemoryUsersRepository();
    refreshTokensRepository = new InMemoryRefreshTokensRepository();
    sut = new LogoutSessionUseCase(sessionsRepository, refreshTokensRepository);
    const jwtSignMock = vi.fn().mockResolvedValue('new-refresh-token');
    reply = { jwtSign: jwtSignMock } as unknown as FastifyReply;
  });

  // OBJECTIVE
  it('should expire session and revoke refresh token', async () => {
    const { user } = await makeUser({
      email: 'user1@example.com',
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

    await makeRefreshToken({
      sessionId: session.id,
      refreshTokensRepository,
    });

    await sut.execute({ sessionId: session.id.toString() });

    await sessionsRepository.findById(new UniqueEntityID(session.id));

    const revokedToken = await refreshTokensRepository.findBySessionId(
      new UniqueEntityID(session.id),
    );
    expect(revokedToken?.revokedAt).toBeInstanceOf(Date);
  });

  // REJECTS
  it('should throw if session does not exist', async () => {
    await expect(
      sut.execute({ sessionId: 'non-existent-session' }),
    ).rejects.toThrow();
  });

  it('should throw if session is already expired', async () => {
    const { user } = await makeUser({
      email: 'user2@example.com',
      password: 'password123',
      usersRepository,
    });
    const { session } = await makeSession({
      userId: user.id,
      ip: '2.2.2.2',
      sessionsRepository,
      usersRepository,
      reply,
    });
    session.expiredAt = new Date();
    await expect(
      sut.execute({ sessionId: session.id.toString() }),
    ).rejects.toThrow();
  });

  it('should throw if session is already revoked', async () => {
    const { user } = await makeUser({
      email: 'user3@example.com',
      password: 'password123',
      usersRepository,
    });
    const { session } = await makeSession({
      userId: user.id,
      ip: '3.3.3.3',
      sessionsRepository,
      usersRepository,
      reply,
    });
    session.revokedAt = new Date();
    await expect(
      sut.execute({ sessionId: session.id.toString() }),
    ).rejects.toThrow();
  });

  it('should throw if refresh token does not exist', async () => {
    const { user } = await makeUser({
      email: 'user4@example.com',
      password: 'password123',
      usersRepository,
    });
    const { session } = await makeSession({
      userId: user.id,
      ip: '4.4.4.4',
      sessionsRepository,
      usersRepository,
      reply,
    });
    await expect(
      sut.execute({ sessionId: session.id.toString() }),
    ).rejects.toThrow();
  });

  // EDGE CASES
  it('should handle multiple logouts for the same session gracefully', async () => {
    const { user } = await makeUser({
      email: 'user5@example.com',
      password: 'password123',
      usersRepository,
    });
    const { session } = await makeSession({
      userId: user.id,
      ip: '5.5.5.5',
      sessionsRepository,
      usersRepository,
      reply,
    });
    await makeRefreshToken({
      sessionId: session.id,
      refreshTokensRepository,
    });

    await sut.execute({ sessionId: session.id.toString() });
    await expect(
      sut.execute({ sessionId: session.id.toString() }),
    ).rejects.toThrow();
  });
});
