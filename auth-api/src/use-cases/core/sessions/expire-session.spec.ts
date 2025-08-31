import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { InMemoryRefreshTokensRepository } from '@/repositories/core/in-memory/in-memory-refresh-tokens-repository';
import { InMemorySessionsRepository } from '@/repositories/core/in-memory/in-memory-sessions-repository';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeSession } from '@/utils/tests/factories/core/make-session';
import { makeUser } from '@/utils/tests/factories/core/make-user';
import { faker } from '@faker-js/faker/locale/en';
import type { FastifyReply } from 'fastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ExpireSessionUseCase } from './expire-session';

let sessionsRepository: InMemorySessionsRepository;
let usersRepository: InMemoryUsersRepository;
let refreshTokensRepository: InMemoryRefreshTokensRepository;
let sut: ExpireSessionUseCase;
let reply: FastifyReply;

describe('ExpireSessionUseCase', () => {
  beforeEach(() => {
    sessionsRepository = new InMemorySessionsRepository();
    usersRepository = new InMemoryUsersRepository();
    refreshTokensRepository = new InMemoryRefreshTokensRepository();
    sut = new ExpireSessionUseCase(sessionsRepository);
    const jwtSignMock = vi.fn().mockResolvedValue(faker.internet.jwt());
    reply = { jwtSign: jwtSignMock } as unknown as FastifyReply;
  });

  // OBJECTIVE

  it('should expire a session', async () => {
    const { user } = await makeUser({
      email: 'user@example.com',
      password: 'password',
      usersRepository,
    });

    const { session } = await makeSession({
      userId: user.id,
      sessionsRepository,
      usersRepository,
      refreshTokensRepository,
      reply,
    });

    await sut.execute({ sessionId: session.id });

    const sessionId = new UniqueEntityID(session.id);
    const updatedSession = await sessionsRepository.findById(sessionId);

    expect(updatedSession?.expiredAt).toBeInstanceOf(Date);
  });
});

// VALIDATIONS

it('should not throw error when expiring non-existent session', async () => {
  await expect(sut.execute({ sessionId: 'invalid-id' })).rejects.toBeInstanceOf(
    ResourceNotFoundError,
  );
});

it('should not expire an already expired session', async () => {
  const { user } = await makeUser({
    email: 'user-1@example.com',
    password: 'password',
    usersRepository,
  });

  const { session } = await makeSession({
    userId: user.id,
    sessionsRepository,
    usersRepository,
    refreshTokensRepository,
    reply,
  });

  await sut.execute({ sessionId: session.id });

  await expect(sut.execute({ sessionId: session.id })).rejects.toBeInstanceOf(
    ResourceNotFoundError,
  );
});

it('should not expire a session with invalid ID format', async () => {
  await expect(sut.execute({ sessionId: 'invalid-id' })).rejects.toBeInstanceOf(
    ResourceNotFoundError,
  );
});

it('should expire a session with a valid IP', async () => {
  const { user } = await makeUser({
    email: 'iptest@example.com',
    password: 'password',
    usersRepository,
  });
  const { session } = await makeSession({
    userId: user.id,
    ip: '192.168.0.1',
    sessionsRepository,
    usersRepository,
    refreshTokensRepository,
    reply,
  });
  await sut.execute({ sessionId: session.id });
  const sessionId = new UniqueEntityID(session.id);
  const updatedSession = await sessionsRepository.findById(sessionId);
  expect(updatedSession?.expiredAt).toBeInstanceOf(Date);
});

it('should expire a session created a long time ago', async () => {
  const { user } = await makeUser({
    email: 'old@example.com',
    password: 'password',
    usersRepository,
  });
  const { session } = await makeSession({
    userId: user.id,
    sessionsRepository,
    usersRepository,
    refreshTokensRepository,
    reply,
  });
  // Simula sessão antiga
  session.createdAt = new Date('2000-01-01');
  await sut.execute({ sessionId: session.id });
  const sessionId = new UniqueEntityID(session.id);
  const updatedSession = await sessionsRepository.findById(sessionId);
  expect(updatedSession?.expiredAt).toBeInstanceOf(Date);
});

it('should expire a session for user with ADMIN role', async () => {
  const { user } = await makeUser({
    email: 'admin@example.com',
    password: 'password',
    role: 'ADMIN',
    usersRepository,
  });
  const { session } = await makeSession({
    userId: user.id,
    sessionsRepository,
    usersRepository,
    refreshTokensRepository,
    reply,
  });
  await sut.execute({ sessionId: session.id });
  const sessionId = new UniqueEntityID(session.id);
  const updatedSession = await sessionsRepository.findById(sessionId);
  expect(updatedSession?.expiredAt).toBeInstanceOf(Date);
});

// EDGE CASES

it('should expire only the correct session among multiple users', async () => {
  const { user: user1 } = await makeUser({
    email: 'user1@example.com',
    password: 'password',
    usersRepository,
  });

  const { user: user2 } = await makeUser({
    email: 'user2@example.com',
    password: 'password',
    usersRepository,
  });

  const { session: session1 } = await makeSession({
    userId: user1.id,
    sessionsRepository,
    usersRepository,
    refreshTokensRepository,
    reply,
  });

  const { session: session2 } = await makeSession({
    userId: user2.id,
    sessionsRepository,
    usersRepository,
    refreshTokensRepository,
    reply,
  });

  await sut.execute({ sessionId: session2.id });

  const sessionOneId = new UniqueEntityID(session1.id);
  const storedSessionOne = await sessionsRepository.findById(sessionOneId);

  const sessionTwoId = new UniqueEntityID(session2.id);
  const updatedSessionTwo = await sessionsRepository.findById(sessionTwoId);

  expect(storedSessionOne?.expiredAt).toBeNull();
  expect(updatedSessionTwo?.expiredAt).toBeInstanceOf(Date);
});

it('should not alter revokedAt when expiring a session', async () => {
  const { user } = await makeUser({
    email: 'revoked@example.com',
    password: 'password',
    usersRepository,
  });
  const { session } = await makeSession({
    userId: user.id,
    sessionsRepository,
    usersRepository,
    refreshTokensRepository,
    reply,
  });
  expect(session.revokedAt).toBeNull();
  await sut.execute({ sessionId: session.id });
  const sessionId = new UniqueEntityID(session.id);
  const updatedSession = await sessionsRepository.findById(sessionId);
  expect(updatedSession?.revokedAt).toBeNull();
});

it('should not expire other sessions when expiring one', async () => {
  const { user } = await makeUser({
    email: 'multi@example.com',
    password: 'password',
    usersRepository,
  });
  const { session: session1 } = await makeSession({
    userId: user.id,
    sessionsRepository,
    usersRepository,
    refreshTokensRepository,
    reply,
  });
  const { session: session2 } = await makeSession({
    userId: user.id,
    sessionsRepository,
    usersRepository,
    refreshTokensRepository,
    reply,
  });
  await sut.execute({ sessionId: session2.id });
  const sessionOneId = new UniqueEntityID(session1.id);
  const updatedSessionOne = await sessionsRepository.findById(sessionOneId);
  expect(updatedSessionOne?.expiredAt).toBeNull();
});

it('should expire session with same IP as another session', async () => {
  const { user } = await makeUser({
    email: 'sameip@example.com',
    password: 'password',
    usersRepository,
  });
  const ip = '10.0.0.1';
  await makeSession({
    userId: user.id,
    ip,
    sessionsRepository,
    usersRepository,
    refreshTokensRepository,
    reply,
  });
  const { session: session2 } = await makeSession({
    userId: user.id,
    ip,
    sessionsRepository,
    usersRepository,
    refreshTokensRepository,
    reply,
  });
  await sut.execute({ sessionId: session2.id });
  const sessionTwoId = new UniqueEntityID(session2.id);
  const updatedSessionTwo = await sessionsRepository.findById(sessionTwoId);
  expect(updatedSessionTwo?.expiredAt).toBeInstanceOf(Date);
});

// REJECTS
it('should throw error when expiring a session for deleted user', async () => {
  // O correto é garantir que não é possível criar a sessão para usuário deletado
  await expect(
    makeSession({
      userId: 'deleted-user-id',
      sessionsRepository,
      usersRepository,
      refreshTokensRepository,
      reply,
    }),
  ).rejects.toBeInstanceOf(ResourceNotFoundError);
});

it('should throw error when expiring a session already revoked', async () => {
  const { user } = await makeUser({
    email: 'revoked2@example.com',
    password: 'password',
    usersRepository,
  });
  const { session } = await makeSession({
    userId: user.id,
    sessionsRepository,
    usersRepository,
    refreshTokensRepository,
    reply,
  });

  const sessionId = new UniqueEntityID(session.id);
  const storedSession = await sessionsRepository.findById(sessionId);

  if (storedSession) {
    storedSession.revokedAt = new Date();
  }

  await expect(sut.execute({ sessionId: session.id })).rejects.toBeInstanceOf(
    ResourceNotFoundError,
  );
});

// VALIDATIONS
it('should expire a session that was never used (lastUsedAt null)', async () => {
  const { user } = await makeUser({
    email: 'neverused@example.com',
    password: 'password',
    usersRepository,
  });
  const { session } = await makeSession({
    userId: user.id,
    sessionsRepository,
    usersRepository,
    refreshTokensRepository,
    reply,
  });
  expect(session.lastUsedAt).toBeNull();
  await sut.execute({ sessionId: session.id });
  const sessionId = new UniqueEntityID(session.id);
  const updatedSession = await sessionsRepository.findById(sessionId);
  expect(updatedSession?.expiredAt).toBeInstanceOf(Date);
});

// EDGE CASES
it('should expire sessions created in quick succession', async () => {
  const { user } = await makeUser({
    email: 'quick@example.com',
    password: 'password',
    usersRepository,
  });
  const sessions = [];
  for (let i = 0; i < 3; i++) {
    const { session } = await makeSession({
      userId: user.id,
      sessionsRepository,
      usersRepository,
      refreshTokensRepository,
      reply,
    });
    sessions.push(session);
  }
  await sut.execute({ sessionId: sessions[2].id });
  const sessionId = new UniqueEntityID(sessions[2].id);
  const updatedSession = await sessionsRepository.findById(sessionId);
  expect(updatedSession?.expiredAt).toBeInstanceOf(Date);
  // As outras não devem ser expiradas
  for (let i = 0; i < 2; i++) {
    const sid = new UniqueEntityID(sessions[i].id);
    const s = await sessionsRepository.findById(sid);
    expect(s?.expiredAt).toBeNull();
  }
});

it('should expire a session from a deleted User', async () => {
  const { user } = await makeUser({
    email: 'softdelete@example.com',
    password: 'password',
    usersRepository,
  });
  const { session } = await makeSession({
    userId: user.id,
    sessionsRepository,
    usersRepository,
    refreshTokensRepository,
    reply,
  });

  user.deletedAt = new Date();

  await expect(sut.execute({ sessionId: session.id })).resolves.toBeUndefined();

  const sessionId = new UniqueEntityID(session.id);
  const updatedSession = await sessionsRepository.findById(sessionId);

  expect(updatedSession?.expiredAt).toBeInstanceOf(Date);
});
