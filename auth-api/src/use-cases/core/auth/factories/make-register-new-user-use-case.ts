import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { RegisterNewUserUseCase } from '../register-new-user';

export function makeRegisterNewUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const registerNewUser = new RegisterNewUserUseCase(usersRepository);

  return registerNewUser;
}
