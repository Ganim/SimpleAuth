import { InMemorySessionsRepository } from '@/repositories/in-memory/in-memory-sessions-repository';
import { describe, expect, it } from 'vitest';
import { ListAllActiveSessionsUseCase } from './list-all-active-sessions';

describe('ListAllActiveSessionsUseCase', () => {
  it('deve listar apenas sessões ativas', async () => {
    const repo = new InMemorySessionsRepository();
    // Sessão ativa
    await repo.create({ userId: 'user-1', ip: '127.0.0.1' });
    // Sessão expirada
    const expired = await repo.create({ userId: 'user-2', ip: '127.0.0.2' });
    await repo.expire(expired.id);
    // Sessão revogada
    const revoked = await repo.create({ userId: 'user-3', ip: '127.0.0.3' });
    await repo.revoke(revoked.id);
    const useCase = new ListAllActiveSessionsUseCase(repo);
    const { sessions } = await useCase.execute();
    expect(sessions.length).toBe(1);
    expect(sessions[0].userId).toBe('user-1');
  });
});
