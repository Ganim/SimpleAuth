import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { ListAllUserUseCase } from '../list-all-users';

export function makeListAllUsersUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const listAllUsersUseCase = new ListAllUserUseCase(usersRepository);
  return listAllUsersUseCase;
}
