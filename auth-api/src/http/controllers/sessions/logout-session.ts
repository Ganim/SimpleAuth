import { makeLogoutSessionUseCase } from '@/use-cases/sessions/factories/make-logout-session-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const logoutSessionBodySchema = z.object({
  sessionId: z.string(),
});

// CONTROLLER
export async function logoutSessionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sessionId } = logoutSessionBodySchema.parse(request.body);
  if (!sessionId) {
    return reply.code(400).send({ message: 'Session ID is required' });
  }
  const logoutSession = makeLogoutSessionUseCase();
  await logoutSession.execute(sessionId);
  return reply.code(204).send();
}

// ATTRIBUTES
export const logoutSessionSchema = {
  tags: ['Sessions'],
  summary: 'Logout a session',
  body: {
    type: 'object',
    properties: {
      sessionId: { type: 'string', description: 'Session ID to logout' },
    },
    required: ['sessionId'],
    additionalProperties: false,
  },
  response: {
    204: { description: 'Session logged out successfully' },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: { message: { type: 'string' } },
      required: ['message'],
    },
  },
};
