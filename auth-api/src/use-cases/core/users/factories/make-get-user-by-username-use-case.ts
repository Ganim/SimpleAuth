import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { GetUserByUsernameUseCase } from '../get-user-by-username';

export function makeGetUserByUsernameUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new GetUserByUsernameUseCase(usersRepository);
}
