import { ForbiddenError } from '@/@errors/use-cases/forbidden-error';
import type { FastifyRequest } from 'fastify';

export async function verifyUserManager(request: FastifyRequest) {
  const { role } = request.user;

  if (role !== 'ADMIN' && role !== 'MANAGER') {
    throw new ForbiddenError('Only MANAGER or ADMIN can perform this action');
  }
}
