import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { EditUserUseCase } from '../edit-user';

export function makeEditUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new EditUserUseCase(usersRepository);
}
