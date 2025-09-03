import { ForbiddenError } from '@/@errors/use-cases/forbidden-error';
import { Role } from '@/entities/core/value-objects/role';
import type { FastifyRequest } from 'fastify';

export async function verifyUserAdmin(request: FastifyRequest) {
  const { role } = request.user;

  if (!Role.checkRole(role, 'ADMIN')) {
    throw new ForbiddenError('Only ADMIN can change user roles');
  }
}
