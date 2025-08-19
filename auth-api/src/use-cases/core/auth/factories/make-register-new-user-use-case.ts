import { PrismaProfilesRepository } from '@/repositories/prisma/prisma-profiles-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { RegisterNewUserUseCase } from '../register-new-user';

export function makeRegisterNewUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const profilesRepository = new PrismaProfilesRepository();
  const registerNewUser = new RegisterNewUserUseCase(
    usersRepository,
    profilesRepository,
  );

  return registerNewUser;
}
