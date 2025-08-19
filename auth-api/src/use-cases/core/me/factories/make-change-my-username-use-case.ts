import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ChangeMyUsernameUseCase } from '../change-my-username';

export function makeChangeMyUsernameUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new ChangeMyUsernameUseCase(usersRepository);
}
