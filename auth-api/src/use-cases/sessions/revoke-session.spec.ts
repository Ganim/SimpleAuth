import { InMemorySessionsRepository } from '@/repositories/in-memory/in-memory-sessions-repository';
import { describe, expect, it } from 'vitest';
import { CreateSessionUseCase } from './create-session';
import { RevokeSessionUseCase } from './revoke-session';

describe('RevokeSessionUseCase', () => {
  it('should revoke a session', async () => {
    const repo = new InMemorySessionsRepository();
    const createSession = new CreateSessionUseCase(repo);
    const { session } = await createSession.execute('user-1', '127.0.0.1');
    const revokeSession = new RevokeSessionUseCase(repo);
    await revokeSession.execute(session.id);
    expect(session.revokedAt).toBeInstanceOf(Date);
  });
});

it('should not throw error when revoking non-existent session', async () => {
  const repo = new InMemorySessionsRepository();
  const revokeSession = new RevokeSessionUseCase(repo);
  await expect(revokeSession.execute('invalid-id')).resolves.toBeUndefined();
});

it('should revoke only the correct session among multiple users', async () => {
  const repo = new InMemorySessionsRepository();
  const createSession = new CreateSessionUseCase(repo);
  const { session: s1 } = await createSession.execute('user-1', '127.0.0.1');
  const { session: s2 } = await createSession.execute('user-2', '127.0.0.2');
  const revokeSession = new RevokeSessionUseCase(repo);
  await revokeSession.execute(s2.id);
  expect(s1.revokedAt).toBeNull();
  expect(s2.revokedAt).toBeInstanceOf(Date);
});
