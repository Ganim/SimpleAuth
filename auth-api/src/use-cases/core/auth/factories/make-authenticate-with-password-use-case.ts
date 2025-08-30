import { PrismaSessionsRepository } from '@/repositories/core/prisma/prisma-sessions-repository';
import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { CreateSessionUseCase } from '@/use-cases/core/sessions/create-session';
import { AuthenticateWithPasswordUseCase } from '../authenticate-with-password';

export function makeAuthenticateWithPasswordUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const sessionsRepository = new PrismaSessionsRepository();
  const createSessionUseCase = new CreateSessionUseCase(sessionsRepository);

  const authenticateUseCase = new AuthenticateWithPasswordUseCase(
    usersRepository,
    createSessionUseCase,
  );
  return authenticateUseCase;
}
