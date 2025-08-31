import { makeRefreshSessionUseCase } from '@/use-cases/core/sessions/factories/make-refresh-session-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';

type RefreshSessionBody = { sessionId: string };

export async function refreshSessionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sessionId } = request.body as RefreshSessionBody;
  const ip = request.ip ?? request.headers['x-forwarded-for'] ?? '';
  if (!sessionId) {
    return reply.code(400).send({ message: 'Session ID is required' });
  }
  const refreshSessionUseCase = makeRefreshSessionUseCase();
  await refreshSessionUseCase.execute(sessionId, ip);
  return reply.code(204).send();
}
