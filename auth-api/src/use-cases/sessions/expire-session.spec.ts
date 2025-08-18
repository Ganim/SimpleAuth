import { InMemorySessionsRepository } from '@/repositories/in-memory/in-memory-sessions-repository';
import { describe, expect, it } from 'vitest';
import { CreateSessionUseCase } from './create-session';
import { ExpireSessionUseCase } from './expire-session';

describe('ExpireSessionUseCase', () => {
  it('deve expirar uma sessão', async () => {
    const repo = new InMemorySessionsRepository();
    const createSession = new CreateSessionUseCase(repo);
    const { session } = await createSession.execute('user-1', '127.0.0.1');
    const expireSession = new ExpireSessionUseCase(repo);
    await expireSession.execute(session.id);
    expect(session.expiredAt).toBeInstanceOf(Date);
  });
});

it('não deve lançar erro ao tentar expirar sessão inexistente', async () => {
  const repo = new InMemorySessionsRepository();
  const expireSession = new ExpireSessionUseCase(repo);
  await expect(expireSession.execute('invalid-id')).resolves.toBeUndefined();
});

it('deve expirar apenas a sessão correta entre múltiplos usuários', async () => {
  const repo = new InMemorySessionsRepository();
  const createSession = new CreateSessionUseCase(repo);
  const { session: s1 } = await createSession.execute('user-1', '127.0.0.1');
  const { session: s2 } = await createSession.execute('user-2', '127.0.0.2');
  const expireSession = new ExpireSessionUseCase(repo);
  await expireSession.execute(s2.id);
  expect(s1.expiredAt).toBeNull();
  expect(s2.expiredAt).toBeInstanceOf(Date);
});
