import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { ChangeMyProfileUseCase } from '../change-my-profile';

export function makeChangeMyProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new ChangeMyProfileUseCase(usersRepository);
}
