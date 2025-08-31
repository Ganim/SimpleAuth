import { PrismaSessionsRepository } from '@/repositories/core/prisma/prisma-sessions-repository';
import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { ListUserSessionsUseCase } from '../list-user-sessions';

export function makeListUserSessionsUseCase() {
  const sessionsRepository = new PrismaSessionsRepository();
  const usersRepository = new PrismaUsersRepository();
  return new ListUserSessionsUseCase(sessionsRepository, usersRepository);
}
