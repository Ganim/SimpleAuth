import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { PrismaProfilesRepository } from '@/repositories/prisma/prisma-profiles-repository';
import { GetUserByIdUseCase } from '../get-user-by-id';

export function makeGetUserByIdUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const profilesRepository = new PrismaProfilesRepository();
  return new GetUserByIdUseCase(usersRepository, profilesRepository);
}
