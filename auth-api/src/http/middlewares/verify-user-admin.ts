import { UnauthorizedError } from '@/use-cases/@errors/unauthorized-error';
import type { FastifyRequest } from 'fastify';

export async function verifyUserAdmin(request: FastifyRequest) {
  const { role } = request.user;

  if (role !== 'ADMIN') {
    throw new UnauthorizedError('User not authorized');
  }
}
