import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { ChangeMyUsernameUseCase } from '../change-my-username';

export function makeChangeMyUsernameUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new ChangeMyUsernameUseCase(usersRepository);
}
