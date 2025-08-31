import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { GetUserByIdUseCase } from '../get-user-by-id';

export function makeGetUserByIdUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new GetUserByIdUseCase(usersRepository);
}
