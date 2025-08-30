import { IpAddress } from '@/entities/core/value-objects/ip-address';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { InMemorySessionsRepository } from '@/repositories/core/in-memory/in-memory-sessions-repository';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeUser } from '@/utils/tests/factories/core/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { ListUserSessionsUseCase } from './list-user-sessions';

let sessionsRepository: InMemorySessionsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: ListUserSessionsUseCase;

describe('ListUserSessionsUseCase', () => {
  beforeEach(() => {
    sessionsRepository = new InMemorySessionsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new ListUserSessionsUseCase(sessionsRepository, usersRepository);
  });

  // OBJECTIVE
  it('should list sessions of a user', async () => {
    const { user: user1 } = await makeUser({
      email: 'user1@example.com',
      password: 'password123',
      usersRepository,
    });
    const { user: user2 } = await makeUser({
      email: 'user2@example.com',
      password: 'password123',
      usersRepository,
    });

    await sessionsRepository.create({
      userId: new UniqueEntityID(user1.id),
      ip: new IpAddress('127.0.0.1'),
    });
    await sessionsRepository.create({
      userId: new UniqueEntityID(user1.id),
      ip: new IpAddress('127.0.0.1'),
    });
    await sessionsRepository.create({
      userId: new UniqueEntityID(user2.id),
      ip: new IpAddress('127.0.0.2'),
    });
    await sessionsRepository.create({
      userId: new UniqueEntityID(user1.id),
      ip: new IpAddress('127.0.0.3'),
    });
    const { sessions } = await sut.execute({ userId: user1.id });
    expect(sessions.length).toBe(3);
    expect(
      sessions.every((s: { userId: string }) => s.userId === user1.id),
    ).toBe(true);
  });
});
