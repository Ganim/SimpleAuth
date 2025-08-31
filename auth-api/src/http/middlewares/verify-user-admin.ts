import { ForbiddenError } from '@/@errors/use-cases/forbidden-error';
import type { FastifyRequest } from 'fastify';

export async function verifyUserAdmin(request: FastifyRequest) {
  const { role } = request.user;

  if (role !== 'ADMIN') {
    throw new ForbiddenError('Only ADMIN can change user roles');
  }
}
