import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { DeleteUserByIdUseCase } from '../delete-user-by-id';

export function makeDeleteUserByIdUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new DeleteUserByIdUseCase(usersRepository);
}
