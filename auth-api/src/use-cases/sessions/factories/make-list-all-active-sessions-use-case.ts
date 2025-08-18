import { PrismaSessionsRepository } from '@/repositories/prisma/prisma-sessions-repository';
import { ListAllActiveSessionsUseCase } from '../list-all-active-sessions';

export function makeListAllActiveSessionsUseCase() {
  const sessionsRepository = new PrismaSessionsRepository();
  return new ListAllActiveSessionsUseCase(sessionsRepository);
}
