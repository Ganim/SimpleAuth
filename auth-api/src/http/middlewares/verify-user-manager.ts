import type { FastifyRequest } from 'fastify';

export async function verifyUserManager(request: FastifyRequest) {
  const { role } = request.user;

  if (role !== 'ADMIN' && role !== 'MANAGER') {
    const { ForbiddenError } = await import(
      '@/@errors/use-cases/forbidden-error'
    );
    throw new ForbiddenError('Only MANAGER or ADMIN can perform this action');
  }
}
