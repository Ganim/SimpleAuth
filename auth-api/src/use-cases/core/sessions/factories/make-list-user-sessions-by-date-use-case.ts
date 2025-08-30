import { PrismaSessionsRepository } from '@/repositories/core/prisma/prisma-sessions-repository';
import { ListUserSessionsByDateUseCase } from '../list-user-sessions-by-date';

export function makeListUserSessionsByDateUseCase() {
  const sessionsRepository = new PrismaSessionsRepository();
  return new ListUserSessionsByDateUseCase(sessionsRepository);
}
