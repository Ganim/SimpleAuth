import type { FastifyReply, FastifyRequest } from 'fastify';

export async function verifyUserManager(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { role } = request.user;

  if (role !== 'ADMIN' && role !== 'MANAGER') {
    return reply.status(401).send({ message: 'Unauthorized' });
  }
}
