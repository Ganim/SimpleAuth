import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { GetUserUseCase } from '../get-user';

export function makeGetUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new GetUserUseCase(usersRepository);
}
