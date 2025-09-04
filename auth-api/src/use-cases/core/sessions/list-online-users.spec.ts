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
import { ListOnlineUsersUseCase } from '../users/list-online-users';

let sessionsRepository: InMemorySessionsRepository;
let usersRepository: InMemoryUsersRepository;
let refreshTokensRepository: InMemoryRefreshTokensRepository;
let sut: ListOnlineUsersUseCase;
let reply: FastifyReply;

describe('List Online Users Use Case', () => {
  beforeEach(() => {
    sessionsRepository = new InMemorySessionsRepository();
    usersRepository = new InMemoryUsersRepository();
    refreshTokensRepository = new InMemoryRefreshTokensRepository();
    sut = new ListOnlineUsersUseCase(sessionsRepository, usersRepository);
    const jwtSignMock = vi.fn().mockResolvedValue(faker.internet.jwt());
    reply = { jwtSign: jwtSignMock } as unknown as FastifyReply;
  });

  it('should be able to list online users', async () => {
    const { user: user1 } = await makeUser({
      email: 'user1@example.com',
      password: 'Pass@123',
      usersRepository,
    });
    const { user: user2 } = await makeUser({
      email: 'user2@example.com',
      password: 'Pass@123',
      usersRepository,
    });
    await makeSession({
      userId: user1.id,
      sessionsRepository,
      usersRepository,
      refreshTokensRepository,
      reply,
    });
    await makeSession({
      userId: user2.id,
      sessionsRepository,
      usersRepository,
      refreshTokensRepository,
      reply,
    });
    const result = await sut.execute();
    expect(result.users).toHaveLength(2);
    expect(result.users.map((u) => u.email)).toEqual(
      expect.arrayContaining(['user1@example.com', 'user2@example.com']),
    );
  });

  it('should list user only once even with multiple active sessions', async () => {
    const { user } = await makeUser({
      email: 'user@example.com',
      password: 'Pass@123',
      usersRepository,
    });
    await makeSession({
      userId: user.id,
      sessionsRepository,
      usersRepository,
      refreshTokensRepository,
      reply,
    });
    await makeSession({
      userId: user.id,
      sessionsRepository,
      usersRepository,
      refreshTokensRepository,
      reply,
    });
    await makeSession({
      userId: user.id,
      sessionsRepository,
      usersRepository,
      refreshTokensRepository,
      reply,
    });
    const result = await sut.execute();
    expect(result.users).toHaveLength(1);
    expect(result.users[0]).toEqual(
      expect.objectContaining({
        id: user.id,
        email: 'user@example.com',
      }),
    );
  });

  it('should not include deleted users in online list', async () => {
    const { user: deletedUser } = await makeUser({
      email: 'deleted@example.com',
      password: 'Pass@123',
      usersRepository,
    });
    const { user: activeUser } = await makeUser({
      email: 'active@example.com',
      password: 'Pass@123',
      usersRepository,
    });
    await makeSession({
      userId: deletedUser.id,
      sessionsRepository,
      usersRepository,
      refreshTokensRepository,
      reply,
    });
    await makeSession({
      userId: activeUser.id,
      sessionsRepository,
      usersRepository,
      refreshTokensRepository,
      reply,
    });
    // Marks the user as deleted after creating the session
    deletedUser.deletedAt = new Date();
    await usersRepository.update({
      id: new UniqueEntityID(deletedUser.id),
      deletedAt: deletedUser.deletedAt,
    });
    const result = await sut.execute();
    expect(result.users).toHaveLength(1);
    expect(result.users[0]).toEqual(
      expect.objectContaining({
        id: activeUser.id,
        email: 'active@example.com',
      }),
    );
  });

  it('should throw ResourceNotFoundError when no active sessions exist', async () => {
    await makeUser({
      email: 'user@example.com',
      password: 'Pass@123',
      usersRepository,
    });
    await expect(() => sut.execute()).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });

  it('should throw ResourceNotFoundError when all users with active sessions are deleted', async () => {
    const { user: deletedUser } = await makeUser({
      email: 'deleted@example.com',
      password: 'Pass@123',
      usersRepository,
    });
    await makeSession({
      userId: deletedUser.id,
      sessionsRepository,
      usersRepository,
      refreshTokensRepository,
      reply,
    });
    // Marks the user as deleted after creating the session
    deletedUser.deletedAt = new Date();
    await usersRepository.update({
      id: new UniqueEntityID(deletedUser.id),
      deletedAt: deletedUser.deletedAt,
    });
    await expect(() => sut.execute()).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });

  it('should return users with correct DTO format', async () => {
    const { user } = await makeUser({
      email: 'test@example.com',
      password: 'Pass@123',
      usersRepository,
    });
    await makeSession({
      userId: user.id,
      sessionsRepository,
      usersRepository,
      refreshTokensRepository,
      reply,
    });
    const result = await sut.execute();
    expect(result.users).toHaveLength(1);
    expect(result.users[0]).toEqual(
      expect.objectContaining({
        id: user.id,
        email: 'test@example.com',
        role: 'USER',
      }),
    );
  });
});
