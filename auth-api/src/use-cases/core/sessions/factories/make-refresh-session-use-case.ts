import { PrismaRefreshTokensRepository } from '@/repositories/core/prisma/prisma-refresh-tokens-repository';
import { PrismaSessionsRepository } from '@/repositories/core/prisma/prisma-sessions-repository';
import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { RefreshSessionUseCase } from '../refresh-session';

export function makeRefreshSessionUseCase() {
  const sessionsRepository = new PrismaSessionsRepository();
  const usersRepository = new PrismaUsersRepository();
  const refreshTokensRepository = new PrismaRefreshTokensRepository();
  return new RefreshSessionUseCase(
    sessionsRepository,
    usersRepository,
    refreshTokensRepository,
  );
}
