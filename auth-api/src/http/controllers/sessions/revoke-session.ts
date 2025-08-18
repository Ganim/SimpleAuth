import { makeRevokeSessionUseCase } from '@/use-cases/sessions/factories/make-revoke-session-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function revokeSessionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sessionId } = request.body as { sessionId: string };
  const revokeSession = makeRevokeSessionUseCase();
  await revokeSession.execute(sessionId);
  return reply.code(204).send();
}
