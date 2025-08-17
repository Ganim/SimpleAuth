import type { FastifyRequest } from 'fastify';

export async function verifyUserManager(request: FastifyRequest) {
  const { role } = request.user;

  if (role !== 'ADMIN' && role !== 'MANAGER') {
    const { ForbiddenError } = await import(
      '@/use-cases/@errors/forbidden-error'
    );
    throw new ForbiddenError('Only MANAGER or ADMIN can perform this action');
  }
}
