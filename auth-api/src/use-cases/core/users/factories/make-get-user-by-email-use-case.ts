import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { GetUserByEmailUseCase } from '../get-user-by-email';

export function makeGetUserByEmailUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new GetUserByEmailUseCase(usersRepository);
}
