import { PrismaSessionsRepository } from '@/repositories/core/prisma/prisma-sessions-repository';
import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { ListOnlineUsersUseCase } from '../../users/list-online-users';

export function makeListOnlineUsersUseCase() {
  const sessionsRepository = new PrismaSessionsRepository();
  const usersRepository = new PrismaUsersRepository();
  return new ListOnlineUsersUseCase(sessionsRepository, usersRepository);
}
