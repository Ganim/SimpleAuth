import { PrismaSessionsRepository } from '@/repositories/prisma/prisma-sessions-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { CreateSessionUseCase } from '@/use-cases/sessions/create-session';
import { AuthenticateUserUseCase } from '../authenticate-user';

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const sessionsRepository = new PrismaSessionsRepository();
  const createSessionUseCase = new CreateSessionUseCase(sessionsRepository);
  const authenticateUseCase = new AuthenticateUserUseCase(
    usersRepository,
    createSessionUseCase,
  );
  return authenticateUseCase;
}
