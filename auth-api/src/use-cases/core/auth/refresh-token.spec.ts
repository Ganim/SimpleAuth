import { InMemorySessionsRepository } from '@/repositories/in-memory/in-memory-sessions-repository';
import type { FastifyReply } from 'fastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JwtPayload, RefreshTokenUseCase } from './refresh-token';

let sessionsRepository: InMemorySessionsRepository;
let sut: RefreshTokenUseCase;

describe('Refresh Token Use Case', () => {
  beforeEach(() => {
    sessionsRepository = new InMemorySessionsRepository();
    sut = new RefreshTokenUseCase(sessionsRepository);
  });

  it('should update session and return tokens', async () => {
    const jwtSignMock = vi
      .fn()
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');

    const reply = { jwtSign: jwtSignMock } as unknown as FastifyReply;
    const payload: JwtPayload = {
      sub: 'user-id',
      role: 'USER',
      sessionId: 'sess-1',
    };

    const spy = vi.spyOn(sessionsRepository, 'updateSessionInfo');

    const result = await sut.execute({
      sessionId: 'sess-1',
      ip: '127.0.0.1',
      user: payload,
      reply,
    });

    expect(spy).toHaveBeenCalledWith('sess-1', '127.0.0.1');
    expect(jwtSignMock).toHaveBeenCalledTimes(2);
    expect(result.token).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
  });
});
