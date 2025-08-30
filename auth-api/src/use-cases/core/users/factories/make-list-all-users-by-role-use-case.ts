import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { PrismaProfilesRepository } from '@/repositories/prisma/prisma-profiles-repository';
import { ListAllUserByRoleUseCase } from '../list-all-users-by-role';

export function makeListAllUsersByRoleUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const profilesRepository = new PrismaProfilesRepository();
  const listAllUsersUseCase = new ListAllUserByRoleUseCase(
    usersRepository,
    profilesRepository,
  );

  return listAllUsersUseCase;
}
