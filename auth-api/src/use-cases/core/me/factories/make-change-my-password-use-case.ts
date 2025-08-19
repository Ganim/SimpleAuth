import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ChangeMyPasswordUseCase } from '../change-my-password';

export function makeChangeMyPasswordUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new ChangeMyPasswordUseCase(usersRepository);
}
