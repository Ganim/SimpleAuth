import { PrismaSessionsRepository } from '@/repositories/core/prisma/prisma-sessions-repository';
import { ListMySessionsUseCase } from '../list-my-sessions';

export function makeListMySessionsUseCase() {
  const sessionsRepository = new PrismaSessionsRepository();
  return new ListMySessionsUseCase(sessionsRepository);
}
