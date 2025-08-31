import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { ChangeMyEmailUseCase } from '../change-my-email';

export function makeChangeMyEmailUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new ChangeMyEmailUseCase(usersRepository);
}
