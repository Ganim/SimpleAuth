import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { InMemorySessionsRepository } from '@/repositories/core/in-memory/in-memory-sessions-repository';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeSession } from '@/utils/tests/factories/make-session';
import { makeUser } from '@/utils/tests/factories/make-user';
import type { FastifyReply } from 'fastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RevokeSessionUseCase } from './revoke-session';

let sessionsRepository: InMemorySessionsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: RevokeSessionUseCase;
let reply: FastifyReply;

describe('RevokeSessionUseCase', () => {
  beforeEach(() => {
    sessionsRepository = new InMemorySessionsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new RevokeSessionUseCase(sessionsRepository);
    const jwtSignMock = vi.fn().mockResolvedValue('new-refresh-token');
    reply = { jwtSign: jwtSignMock } as unknown as FastifyReply;
  });

  // OBJECTIVE

  it('should revoke a session', async () => {
    const { user } = await makeUser({
      email: 'user@example.com',
      password: 'password',
      usersRepository,
    });

    const { session } = await makeSession({
      userId: user.id,
      sessionsRepository,
      usersRepository,
      reply,
    });

    await sut.execute({ sessionId: session.id });

    const sessionId = new UniqueEntityID(session.id);
    const updatedSession = await sessionsRepository.findById(sessionId);

    expect(updatedSession?.revokedAt).toBeInstanceOf(Date);
  });
});

// VALIDATIONS

it('should not throw error when revoking non-existent session', async () => {
  await expect(sut.execute({ sessionId: 'invalid-id' })).rejects.toBeInstanceOf(
    ResourceNotFoundError,
  );
});

it('should not revoke an already revoked session', async () => {
  const { user } = await makeUser({
    email: 'user-1@example.com',
    password: 'password',
    usersRepository,
  });

  const { session } = await makeSession({
    userId: user.id,
    sessionsRepository,
    usersRepository,
    reply,
  });

  await sut.execute({ sessionId: session.id });

  await expect(sut.execute({ sessionId: session.id })).rejects.toBeInstanceOf(
    ResourceNotFoundError,
  );
});

it('should not revoke a session with invalid ID format', async () => {
  await expect(sut.execute({ sessionId: 'invalid-id' })).rejects.toBeInstanceOf(
    ResourceNotFoundError,
  );
});

it('should revoke a session with a valid IP', async () => {
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
    reply,
  });
  await sut.execute({ sessionId: session.id });
  const sessionId = new UniqueEntityID(session.id);
  const updatedSession = await sessionsRepository.findById(sessionId);
  expect(updatedSession?.revokedAt).toBeInstanceOf(Date);
});

it('should revoke a session created a long time ago', async () => {
  const { user } = await makeUser({
    email: 'old@example.com',
    password: 'password',
    usersRepository,
  });
  const { session } = await makeSession({
    userId: user.id,
    sessionsRepository,
    usersRepository,
    reply,
  });

  session.createdAt = new Date('2000-01-01');
  await sut.execute({ sessionId: session.id });
  const sessionId = new UniqueEntityID(session.id);
  const updatedSession = await sessionsRepository.findById(sessionId);
  expect(updatedSession?.revokedAt).toBeInstanceOf(Date);
});

it('should revoke a session for user with ADMIN role', async () => {
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
    reply,
  });
  await sut.execute({ sessionId: session.id });
  const sessionId = new UniqueEntityID(session.id);
  const updatedSession = await sessionsRepository.findById(sessionId);
  expect(updatedSession?.revokedAt).toBeInstanceOf(Date);
});

// EDGE CASES

it('should revoke only the correct session among multiple users', async () => {
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
    reply,
  });

  const { session: session2 } = await makeSession({
    userId: user2.id,
    sessionsRepository,
    usersRepository,
    reply,
  });

  await sut.execute({ sessionId: session2.id });

  const sessionOneId = new UniqueEntityID(session1.id);
  const storedSessionOne = await sessionsRepository.findById(sessionOneId);

  const sessionTwoId = new UniqueEntityID(session2.id);
  const updatedSessionTwo = await sessionsRepository.findById(sessionTwoId);

  expect(storedSessionOne?.revokedAt).toBeNull();
  expect(updatedSessionTwo?.revokedAt).toBeInstanceOf(Date);
});

it('should not revoke other sessions when revoking one', async () => {
  const { user } = await makeUser({
    email: 'multi@example.com',
    password: 'password',
    usersRepository,
  });
  const { session: session1 } = await makeSession({
    userId: user.id,
    sessionsRepository,
    usersRepository,
    reply,
  });
  const { session: session2 } = await makeSession({
    userId: user.id,
    sessionsRepository,
    usersRepository,
    reply,
  });
  await sut.execute({ sessionId: session2.id });
  const sessionOneId = new UniqueEntityID(session1.id);
  const updatedSessionOne = await sessionsRepository.findById(sessionOneId);
  expect(updatedSessionOne?.revokedAt).toBeNull();
});

it('should revoke session with same IP as another session', async () => {
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
    reply,
  });
  const { session: session2 } = await makeSession({
    userId: user.id,
    ip,
    sessionsRepository,
    usersRepository,
    reply,
  });
  await sut.execute({ sessionId: session2.id });
  const sessionTwoId = new UniqueEntityID(session2.id);
  const updatedSessionTwo = await sessionsRepository.findById(sessionTwoId);
  expect(updatedSessionTwo?.revokedAt).toBeInstanceOf(Date);
});

// REJECTS
it('should throw error when revoking a session for deleted user', async () => {
  await expect(
    makeSession({
      userId: 'deleted-user-id',
      sessionsRepository,
      usersRepository,
      reply,
    }),
  ).rejects.toBeInstanceOf(ResourceNotFoundError);
});

it('should throw error when revoking a session already expired', async () => {
  const { user } = await makeUser({
    email: 'expired2@example.com',
    password: 'password',
    usersRepository,
  });
  const { session } = await makeSession({
    userId: user.id,
    sessionsRepository,
    usersRepository,
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
it('should revoke a session that was never used (lastUsedAt null)', async () => {
  const { user } = await makeUser({
    email: 'neverused@example.com',
    password: 'password',
    usersRepository,
  });
  const { session } = await makeSession({
    userId: user.id,
    sessionsRepository,
    usersRepository,
    reply,
  });
  expect(session.lastUsedAt).toBeNull();
  await sut.execute({ sessionId: session.id });
  const sessionId = new UniqueEntityID(session.id);
  const updatedSession = await sessionsRepository.findById(sessionId);
  expect(updatedSession?.revokedAt).toBeInstanceOf(Date);
});

// EDGE CASES
it('should revoke sessions created in quick succession', async () => {
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
      reply,
    });
    sessions.push(session);
  }
  await sut.execute({ sessionId: sessions[2].id });
  const sessionId = new UniqueEntityID(sessions[2].id);
  const updatedSession = await sessionsRepository.findById(sessionId);
  expect(updatedSession?.revokedAt).toBeInstanceOf(Date);
  // As outras não devem ser expiradas
  for (let i = 0; i < 2; i++) {
    const sid = new UniqueEntityID(sessions[i].id);
    const s = await sessionsRepository.findById(sid);
    expect(s?.revokedAt).toBeNull();
  }
});

it('should revoke a session from a deleted User', async () => {
  const { user } = await makeUser({
    email: 'softdelete@example.com',
    password: 'password',
    usersRepository,
  });
  const { session } = await makeSession({
    userId: user.id,
    sessionsRepository,
    usersRepository,
    reply,
  });

  user.deletedAt = new Date();

  await expect(sut.execute({ sessionId: session.id })).resolves.toBeUndefined();

  const sessionId = new UniqueEntityID(session.id);
  const updatedSession = await sessionsRepository.findById(sessionId);

  expect(updatedSession?.revokedAt).toBeInstanceOf(Date);
});
