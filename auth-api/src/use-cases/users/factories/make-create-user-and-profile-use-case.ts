import { PrismaProfilesRepository } from '@/repositories/prisma/prisma-profiles-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { CreateUserAndProfileUseCase } from '../create-user-and-profile';

export function makeCreateUserAndProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const profilesRepository = new PrismaProfilesRepository();
  const createUserAndProfileUseCase = new CreateUserAndProfileUseCase(
    usersRepository,
    profilesRepository,
  );

  return createUserAndProfileUseCase;
}
