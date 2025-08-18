import { PrismaSessionsRepository } from '@/repositories/prisma/prisma-sessions-repository';
import { RevokeSessionUseCase } from '../revoke-session';

export function makeRevokeSessionUseCase() {
  const sessionsRepository = new PrismaSessionsRepository();
  return new RevokeSessionUseCase(sessionsRepository);
}
