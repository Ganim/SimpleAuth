import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ChangeUserPasswordUseCase } from '../change-user-password';

export function makeChangeUserPasswordUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new ChangeUserPasswordUseCase(usersRepository);
}
