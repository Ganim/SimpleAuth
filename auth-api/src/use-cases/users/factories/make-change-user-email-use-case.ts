import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ChangeUserEmailUseCase } from '../change-user-email';

export function makeChangeUserEmailUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new ChangeUserEmailUseCase(usersRepository);
}
