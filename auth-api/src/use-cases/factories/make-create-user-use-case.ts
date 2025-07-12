import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { CreteUserUseCase } from '../create-user';

export function makeCreateUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const createUserUseCase = new CreteUserUseCase(usersRepository);

  return createUserUseCase;
}
