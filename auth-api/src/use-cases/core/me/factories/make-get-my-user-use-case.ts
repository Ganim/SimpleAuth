import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { GetMyUserUseCase } from '../get-my-user';

export function makeGetMyProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new GetMyUserUseCase(usersRepository);
}
