import { UnauthorizedError } from '@/use-cases/@errors/unauthorized-error';
import type { FastifyRequest } from 'fastify';

export async function verifyUserManager(request: FastifyRequest) {
  const { role } = request.user;

  if (role !== 'ADMIN' && role !== 'MANAGER') {
    throw new UnauthorizedError('User not authorized');
  }
}
