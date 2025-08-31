import { PrismaSessionsRepository } from '@/repositories/core/prisma/prisma-sessions-repository';
import { PrismaRefreshTokensRepository } from '../../../../repositories/core/prisma/prisma-refresh-tokens-repository';
import { LogoutSessionUseCase } from '../logout-session';

export function makeLogoutSessionUseCase() {
  const sessionsRepository = new PrismaSessionsRepository();
  const refreshTokensRepository = new PrismaRefreshTokensRepository();
  return new LogoutSessionUseCase(sessionsRepository, refreshTokensRepository);
}
