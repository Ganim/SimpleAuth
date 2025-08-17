import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ChangeMyEmailUseCase } from '../change-my-email';

export function makeChangeMyEmailUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new ChangeMyEmailUseCase(usersRepository);
}
