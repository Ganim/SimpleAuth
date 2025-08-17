import { PrismaProfilesRepository } from '@/repositories/prisma/prisma-profiles-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { CreateUserUseCase } from '../create-user';

export function makeCreateUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const profilesRepository = new PrismaProfilesRepository();
  const createUserUseCase = new CreateUserUseCase(
    usersRepository,
    profilesRepository,
  );

  return createUserUseCase;
}
