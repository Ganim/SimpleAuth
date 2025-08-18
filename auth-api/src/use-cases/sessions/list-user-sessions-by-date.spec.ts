import { InMemorySessionsRepository } from '@/repositories/in-memory/in-memory-sessions-repository';
import { describe, expect, it } from 'vitest';
import { ListUserSessionsByDateUseCase } from './list-user-sessions-by-date';

describe('ListUserSessionsByDateUseCase', () => {
  it('deve filtrar sessões por usuário e intervalo de datas', async () => {
    const repo = new InMemorySessionsRepository();
    const now = new Date();
    const before = new Date(now.getTime() - 1000 * 60 * 60);
    const after = new Date(now.getTime() + 1000 * 60 * 60);
    // Sessão dentro do intervalo
    const s1 = await repo.create({ userId: 'user-1', ip: '127.0.0.1' });
    s1.createdAt = now;
    // Sessão fora do intervalo
    const s2 = await repo.create({ userId: 'user-1', ip: '127.0.0.2' });
    s2.createdAt = new Date(now.getTime() - 1000 * 60 * 120);
    // Sessão de outro usuário
    await repo.create({ userId: 'user-2', ip: '127.0.0.3' });
    const useCase = new ListUserSessionsByDateUseCase(repo);
    const { sessions } = await useCase.execute('user-1', before, after);
    expect(sessions.length).toBe(1);
    expect(sessions[0].ip).toBe('127.0.0.1');
  });
});
