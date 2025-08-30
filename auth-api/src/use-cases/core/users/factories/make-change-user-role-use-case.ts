import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { ChangeUserRoleUseCase } from '../change-user-role';

export function makeChangeUserRoleUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new ChangeUserRoleUseCase(usersRepository);
}
