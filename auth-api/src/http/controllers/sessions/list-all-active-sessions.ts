import { makeListAllActiveSessionsUseCase } from '@/use-cases/sessions/factories/make-list-all-active-sessions-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function listAllActiveSessionsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listAllActiveSessions = makeListAllActiveSessionsUseCase();
  const result = await listAllActiveSessions.execute();
  return reply.code(200).send(result);
}
