import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { ListAllUserByRoleUseCase } from '../list-all-users-by-role';

export function makeListAllUsersByRoleUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const listAllUsersUseCase = new ListAllUserByRoleUseCase(usersRepository);
  return listAllUsersUseCase;
}
