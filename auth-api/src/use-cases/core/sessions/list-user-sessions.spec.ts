import { InMemorySessionsRepository } from '@/repositories/core/in-memory/in-memory-sessions-repository';
import { describe, expect, it } from 'vitest';
import { ListUserSessionsUseCase } from './list-user-sessions';

describe('ListUserSessionsUseCase', () => {
  it('should list sessions of a user', async () => {
    const repo = new InMemorySessionsRepository();
    await repo.create({ userId: 'user-1', ip: '127.0.0.1' });
    await repo.create({ userId: 'user-2', ip: '127.0.0.2' });
    await repo.create({ userId: 'user-1', ip: '127.0.0.3' });
    const useCase = new ListUserSessionsUseCase(repo);
    const { sessions } = await useCase.execute('user-1');
    expect(sessions.length).toBe(2);
    expect(sessions.every((s) => s.userId === 'user-1')).toBe(true);
  });
});
