import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { makeCreateSessionUseCase } from '../../sessions/factories/make-create-session-use-case';
import { AuthenticateWithPasswordUseCase } from '../authenticate-with-password';

export function makeAuthenticateWithPasswordUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const createSessionUseCase = makeCreateSessionUseCase();

  const authenticateUseCase = new AuthenticateWithPasswordUseCase(
    usersRepository,
    createSessionUseCase,
  );
  return authenticateUseCase;
}
