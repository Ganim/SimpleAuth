import { makeExpireSessionUseCase } from '@/use-cases/core/sessions/factories/make-expire-session-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function expireSessionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sessionId } = request.body as { sessionId: string };
  const expireSession = makeExpireSessionUseCase();
  await expireSession.execute(sessionId);
  return reply.code(204).send();
}
