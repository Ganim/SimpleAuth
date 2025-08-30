import { PrismaSessionsRepository } from '@/repositories/core/prisma/prisma-sessions-repository';
import { RefreshTokenUseCase } from '../refresh-token';

export function makeRefreshTokenUseCase() {
  const sessionsRepository = new PrismaSessionsRepository();

  const refreshTokenUseCase = new RefreshTokenUseCase(sessionsRepository);
  return refreshTokenUseCase;
}
