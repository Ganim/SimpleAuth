import { PrismaSessionsRepository } from '@/repositories/core/prisma/prisma-sessions-repository';
import { RefreshSessionUseCase } from '../refresh-session';

export function makeRefreshSessionUseCase() {
  const sessionsRepository = new PrismaSessionsRepository();
  return new RefreshSessionUseCase(sessionsRepository);
}
