import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { ResetPasswordByTokenUseCase } from '../reset-password-by-token';

export function makeResetPasswordByTokenUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new ResetPasswordByTokenUseCase(usersRepository);
}
