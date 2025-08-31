import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { ChangeUserProfileUseCase } from '../change-user-profile';

export function makeChangeUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new ChangeUserProfileUseCase(usersRepository);
}
