import { InMemorySessionsRepository } from '@/repositories/in-memory/in-memory-sessions-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { RefreshSessionUseCase } from './refresh-session';

describe('RefreshSessionUseCase', () => {
  let sessionsRepository: InMemorySessionsRepository;
  let sut: RefreshSessionUseCase;

  beforeEach(() => {
    sessionsRepository = new InMemorySessionsRepository();
    sut = new RefreshSessionUseCase(sessionsRepository);
  });

  it('deve atualizar o lastUsedAt e o ip da sessão', async () => {
    const session = await sessionsRepository.create({
      userId: 'user-1',
      ip: '1.1.1.1',
    });
    expect(session.lastUsedAt).toBeNull();
    expect(session.ip).toBe('1.1.1.1');

    await sut.execute(session.id, '2.2.2.2');
    const updated = sessionsRepository.items.find((s) => s.id === session.id);
    expect(updated?.lastUsedAt).toBeInstanceOf(Date);
    expect(updated?.ip).toBe('2.2.2.2');
  });

  it('deve manter o ip se for igual', async () => {
    const session = await sessionsRepository.create({
      userId: 'user-2',
      ip: '3.3.3.3',
    });
    await sut.execute(session.id, '3.3.3.3');
    const updated = sessionsRepository.items.find((s) => s.id === session.id);
    expect(updated?.ip).toBe('3.3.3.3');
  });
});
