import { IpAddress } from '@/entities/core/value-objects/ip-address';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { InMemorySessionsRepository } from '@/repositories/core/in-memory/in-memory-sessions-repository';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeUser } from '@/utils/tests/factories/core/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { ListUserSessionsByDateUseCase } from './list-user-sessions-by-date';

let sessionsRepository: InMemorySessionsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: ListUserSessionsByDateUseCase;

describe('ListUserSessionsByDateUseCase', () => {
  beforeEach(() => {
    sessionsRepository = new InMemorySessionsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new ListUserSessionsByDateUseCase(
      sessionsRepository,
      usersRepository,
    );
  });

  // OBJECTIVE
  it('should filter sessions by user and date range', async () => {
    const now = new Date();
    const before = new Date(now.getTime() - 1000 * 60 * 60);
    const after = new Date(now.getTime() + 1000 * 60 * 60);

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

    const s1 = await sessionsRepository.create({
      userId: new UniqueEntityID(user1.id),
      ip: IpAddress.create('127.0.0.1'),
    });
    s1.createdAt = now;

    const s2 = await sessionsRepository.create({
      userId: new UniqueEntityID(user1.id),
      ip: IpAddress.create('127.0.0.2'),
    });
    s2.createdAt = new Date(now.getTime() - 1000 * 60 * 120);

    await sessionsRepository.create({
      userId: new UniqueEntityID(user2.id),
      ip: IpAddress.create('127.0.0.3'),
    });
    const { sessions } = await sut.execute({
      userId: user1.id,
      from: before,
      to: after,
    });
    expect(sessions.length).toBe(1);
    expect(sessions[0].ip).toBe('127.0.0.1');
  });
});
