import { InMemorySessionsRepository } from '@/repositories/in-memory/in-memory-sessions-repository';
import { describe, expect, it } from 'vitest';
import { CreateSessionUseCase } from './create-session';
import { RevokeSessionUseCase } from './revoke-session';

describe('RevokeSessionUseCase', () => {
  it('deve revogar uma sessão', async () => {
    const repo = new InMemorySessionsRepository();
    const createSession = new CreateSessionUseCase(repo);
    const { session } = await createSession.execute('user-1', '127.0.0.1');
    const revokeSession = new RevokeSessionUseCase(repo);
    await revokeSession.execute(session.id);
    expect(session.revokedAt).toBeInstanceOf(Date);
  });
});

it('não deve lançar erro ao tentar revogar sessão inexistente', async () => {
  const repo = new InMemorySessionsRepository();
  const revokeSession = new RevokeSessionUseCase(repo);
  await expect(revokeSession.execute('invalid-id')).resolves.toBeUndefined();
});

it('deve revogar apenas a sessão correta entre múltiplos usuários', async () => {
  const repo = new InMemorySessionsRepository();
  const createSession = new CreateSessionUseCase(repo);
  const { session: s1 } = await createSession.execute('user-1', '127.0.0.1');
  const { session: s2 } = await createSession.execute('user-2', '127.0.0.2');
  const revokeSession = new RevokeSessionUseCase(repo);
  await revokeSession.execute(s2.id);
  expect(s1.revokedAt).toBeNull();
  expect(s2.revokedAt).toBeInstanceOf(Date);
});
