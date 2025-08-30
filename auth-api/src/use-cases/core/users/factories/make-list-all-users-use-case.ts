import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { PrismaProfilesRepository } from '@/repositories/prisma/prisma-profiles-repository';
import { ListAllUserUseCase } from '../list-all-users';

export function makeListAllUsersUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const profilesRepository = new PrismaProfilesRepository();
  const listAllUsersUseCase = new ListAllUserUseCase(
    usersRepository,
    profilesRepository,
  );

  return listAllUsersUseCase;
}
