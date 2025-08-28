import type { FastifyRequest } from 'fastify';

export async function verifyUserAdmin(request: FastifyRequest) {
  const { role } = request.user;

  if (role !== 'ADMIN') {
    const { ForbiddenError } = await import(
      '@/@errors/use-cases/forbidden-error'
    );
    throw new ForbiddenError('Only ADMIN can change user roles');
  }
}
