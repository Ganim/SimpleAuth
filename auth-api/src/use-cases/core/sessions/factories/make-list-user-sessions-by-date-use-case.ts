import { PrismaSessionsRepository } from '@/repositories/core/prisma/prisma-sessions-repository';
import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { ListUserSessionsByDateUseCase } from '../list-user-sessions-by-date';

export function makeListUserSessionsByDateUseCase() {
  const sessionsRepository = new PrismaSessionsRepository();
  const usersRepository = new PrismaUsersRepository();
  return new ListUserSessionsByDateUseCase(sessionsRepository, usersRepository);
}
