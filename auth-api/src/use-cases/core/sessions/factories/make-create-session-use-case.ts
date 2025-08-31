import { PrismaRefreshTokensRepository } from '@/repositories/core/prisma/prisma-refresh-tokens-repository';
import { PrismaSessionsRepository } from '@/repositories/core/prisma/prisma-sessions-repository';
import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { CreateSessionUseCase } from '../create-session';

export function makeCreateSessionUseCase() {
  const sessionsRepository = new PrismaSessionsRepository();
  const usersRepository = new PrismaUsersRepository();
  const refreshTokensRepository = new PrismaRefreshTokensRepository();
  return new CreateSessionUseCase(
    sessionsRepository,
    usersRepository,
    refreshTokensRepository,
  );
}
