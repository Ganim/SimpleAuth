import { InMemoryRefreshTokensRepository } from '@/repositories/in-memory/in-memory-refresh-tokens-repository';
import { InMemorySessionsRepository } from '@/repositories/in-memory/in-memory-sessions-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { LogoutSessionUseCase } from './logout-session';

describe('LogoutSessionUseCase', () => {
  let sessionsRepository: InMemorySessionsRepository;
  let refreshTokensRepository: InMemoryRefreshTokensRepository;
  let sut: LogoutSessionUseCase;

  beforeEach(() => {
    sessionsRepository = new InMemorySessionsRepository();
    refreshTokensRepository = new InMemoryRefreshTokensRepository();
    sut = new LogoutSessionUseCase(sessionsRepository, refreshTokensRepository);
  });

  it('should expire session and revoke refresh token', async () => {
    const session = await sessionsRepository.create({
      userId: 'user-1',
      ip: '1.1.1.1',
    });
    refreshTokensRepository.items.push({
      id: 'rt-1',
      sessionId: session.id,
      revokedAt: null,
    });

    await sut.execute(session.id);

    const updatedSession = sessionsRepository.items.find(
      (s) => s.id === session.id,
    );
    expect(updatedSession?.expiredAt).toBeInstanceOf(Date);

    const revokedToken = refreshTokensRepository.items.find(
      (rt: { sessionId: string; revokedAt: Date | null; id: string }) =>
        rt.sessionId === session.id,
    );
    expect(revokedToken?.revokedAt).toBeInstanceOf(Date);
  });

  it('should not throw if refresh token does not exist', async () => {
    const session = await sessionsRepository.create({
      userId: 'user-2',
      ip: '2.2.2.2',
    });
    await sut.execute(session.id);
    const updatedSession = sessionsRepository.items.find(
      (s) => s.id === session.id,
    );
    expect(updatedSession?.expiredAt).toBeInstanceOf(Date);
  });
});
