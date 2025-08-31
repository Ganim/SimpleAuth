import { PrismaSessionsRepository } from '@/repositories/core/prisma/prisma-sessions-repository';
import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { ListMySessionsUseCase } from '../list-my-sessions';

export function makeListMySessionsUseCase() {
  const sessionsRepository = new PrismaSessionsRepository();
  const usersRepository = new PrismaUsersRepository();
  return new ListMySessionsUseCase(sessionsRepository, usersRepository);
}
