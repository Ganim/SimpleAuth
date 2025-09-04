import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { DeleteMyUserUseCase } from '../delete-my-user';

export function makeDeleteMyUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new DeleteMyUserUseCase(usersRepository);
}
