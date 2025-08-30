import { InMemorySessionsRepository } from '@/repositories/core/in-memory/in-memory-sessions-repository';
import { describe, expect, it } from 'vitest';
import { ListMySessionsUseCase } from './list-my-sessions';

describe('ListMySessionsUseCase', () => {
  it('should list only sessions of authenticated user', async () => {
    const repo = new InMemorySessionsRepository();
    await repo.create({ userId: 'user-1', ip: '127.0.0.1' });
    await repo.create({ userId: 'user-2', ip: '127.0.0.2' });
    await repo.create({ userId: 'user-1', ip: '127.0.0.3' });
    const useCase = new ListMySessionsUseCase(repo);
    const { sessions } = await useCase.execute('user-1');
    expect(sessions.length).toBe(2);
    expect(sessions.every((s) => s.userId === 'user-1')).toBe(true);
  });
});
