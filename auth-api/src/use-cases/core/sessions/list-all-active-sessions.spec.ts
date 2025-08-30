import { IpAddress } from '@/entities/core/value-objects/ip-address';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { InMemorySessionsRepository } from '@/repositories/core/in-memory/in-memory-sessions-repository';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { makeUser } from '@/utils/tests/factories/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { ListAllActiveSessionsUseCase } from './list-all-active-sessions';

let sessionsRepository: InMemorySessionsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: ListAllActiveSessionsUseCase;

describe('ListAllActiveSessionsUseCase', () => {
  beforeEach(() => {
    sessionsRepository = new InMemorySessionsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new ListAllActiveSessionsUseCase(sessionsRepository);
  });

  // OBJECTIVE
  it('should list only active sessions', async () => {
    const { user: user1 } = await makeUser({
      email: 'user1@example.com',
      password: 'password123',
      usersRepository,
    });
    await sessionsRepository.create({
      userId: new UniqueEntityID(user1.id),
      ip: new IpAddress('127.0.0.1'),
    });

    const { user: user2 } = await makeUser({
      email: 'user2@example.com',
      password: 'password123',
      usersRepository,
    });
    const expired = await sessionsRepository.create({
      userId: new UniqueEntityID(user2.id),
      ip: new IpAddress('127.0.0.2'),
    });
    await sessionsRepository.expire(expired.id);

    const { user: user3 } = await makeUser({
      email: 'user3@example.com',
      password: 'password123',
      usersRepository,
    });
    const revoked = await sessionsRepository.create({
      userId: new UniqueEntityID(user3.id),
      ip: new IpAddress('127.0.0.3'),
    });
    await sessionsRepository.revoke(revoked.id);

    const { sessions } = await sut.execute();
    expect(sessions.length).toBe(1);
    expect(sessions[0].userId).toBe(user1.id);
  });
});
