import { PrismaProfilesRepository } from '@/repositories/prisma/prisma-profiles-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { GetMyProfileUseCase } from '../get-my-profile';

export function makeGetMyProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const profilesRepository = new PrismaProfilesRepository();
  return new GetMyProfileUseCase(usersRepository, profilesRepository);
}
