import { InMemorySessionsRepository } from '@/repositories/in-memory/in-memory-sessions-repository';
import { describe, expect, it } from 'vitest';
import { CreateSessionUseCase } from './create-session';

describe('CreateSessionUseCase', () => {
  it('deve criar uma sessão válida', async () => {
    const repo = new InMemorySessionsRepository();
    const useCase = new CreateSessionUseCase(repo);

    const { session } = await useCase.execute('user-1', '127.0.0.1');

    expect(session.id).toBeDefined();
    expect(session.userId).toBe('user-1');
    expect(session.ip).toBe('127.0.0.1');
    expect(session.createdAt).toBeInstanceOf(Date);
    expect(session.expiredAt).toBeNull();
    expect(session.revokedAt).toBeNull();
  });
});
