import { PrismaSessionsRepository } from '@/repositories/core/prisma/prisma-sessions-repository';
import { ListUserSessionsUseCase } from '../list-user-sessions';

export function makeListUserSessionsUseCase() {
  const sessionsRepository = new PrismaSessionsRepository();
  return new ListUserSessionsUseCase(sessionsRepository);
}
