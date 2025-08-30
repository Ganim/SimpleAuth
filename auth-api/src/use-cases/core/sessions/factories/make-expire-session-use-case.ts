import { PrismaSessionsRepository } from '@/repositories/core/prisma/prisma-sessions-repository';
import { ExpireSessionUseCase } from '../expire-session';

export function makeExpireSessionUseCase() {
  const sessionsRepository = new PrismaSessionsRepository();
  return new ExpireSessionUseCase(sessionsRepository);
}
