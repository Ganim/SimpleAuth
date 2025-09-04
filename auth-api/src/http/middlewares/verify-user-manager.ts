import { ForbiddenError } from '@/@errors/use-cases/forbidden-error';
import { Role } from '@/entities/core/value-objects/role';
import type { FastifyRequest } from 'fastify';

export async function verifyUserManager(request: FastifyRequest) {
  const { role } = request.user;

  if (!Role.checkRole(role, 'ADMIN') && !Role.checkRole(role, 'MANAGER')) {
    throw new ForbiddenError('Only MANAGER or ADMIN can perform this action');
  }
}
