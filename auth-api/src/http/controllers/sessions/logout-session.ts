import { makeLogoutSessionUseCase } from '@/use-cases/sessions/factories/make-logout-session-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

type LogoutSessionBody = {
  sessionId: string;
};

export async function logoutSessionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sessionId } = request.body as LogoutSessionBody;
  if (!sessionId) {
    return reply.code(400).send({ message: 'Session ID is required' });
  }
  const logoutSession = makeLogoutSessionUseCase();
  await logoutSession.execute(sessionId);
  return reply.code(204).send();
}
