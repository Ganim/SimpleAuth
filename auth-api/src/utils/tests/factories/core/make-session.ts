import { InMemoryRefreshTokensRepository } from '@/repositories/core/in-memory/in-memory-refresh-tokens-repository';
import { InMemorySessionsRepository } from '@/repositories/core/in-memory/in-memory-sessions-repository';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { CreateSessionUseCase } from '@/use-cases/core/sessions/create-session';
import { faker } from '@faker-js/faker/locale/en';
import type { FastifyReply } from 'fastify';

interface makeSessionProps {
  userId: string;
  ip?: string;
  sessionsRepository: InMemorySessionsRepository;
  usersRepository: InMemoryUsersRepository;
  refreshTokensRepository: InMemoryRefreshTokensRepository;
  reply: FastifyReply;
}

export async function makeSession({
  userId,
  ip = faker.internet.ip(),
  sessionsRepository,
  usersRepository,
  refreshTokensRepository,
  reply,
}: makeSessionProps) {
  const createSessionUseCase = new CreateSessionUseCase(
    sessionsRepository,
    usersRepository,
    refreshTokensRepository,
  );

  return await createSessionUseCase.execute({
    userId,
    ip,
    reply,
  });
}
