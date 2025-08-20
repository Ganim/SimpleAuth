import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ChangeUserUsernameUseCase } from '../change-user-username';

export function makeChangeUserUsernameUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new ChangeUserUsernameUseCase(usersRepository);
}
