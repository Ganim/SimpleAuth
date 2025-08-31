import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { GetMyUserUseCase } from '../get-my-user';

export function makeGetMyUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new GetMyUserUseCase(usersRepository);
}
