import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { ChangeMyPasswordUseCase } from '../change-my-password';

export function makeChangeMyPasswordUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new ChangeMyPasswordUseCase(usersRepository);
}
