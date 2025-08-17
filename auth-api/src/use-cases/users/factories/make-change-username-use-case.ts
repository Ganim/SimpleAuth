import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ChangeUsernameUseCase } from '../change-username';

export function makeChangeUsernameUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new ChangeUsernameUseCase(usersRepository);
}
