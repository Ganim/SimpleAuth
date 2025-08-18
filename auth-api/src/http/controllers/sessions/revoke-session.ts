import { makeRevokeSessionUseCase } from '@/use-cases/sessions/factories/make-revoke-session-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const revokeSessionBodySchema = z.object({
  sessionId: z.string(),
});

// CONTROLLER
export async function revokeSessionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sessionId } = revokeSessionBodySchema.parse(request.body);
  const revokeSession = makeRevokeSessionUseCase();
  await revokeSession.execute(sessionId);
  return reply.code(204).send();
}

// ATTRIBUTES
export const revokeSessionSchema = {
  tags: ['Sessions'],
  summary: 'Revoke a session',
  body: {
    type: 'object',
    properties: {
      sessionId: { type: 'string', description: 'Session ID to revoke' },
    },
    required: ['sessionId'],
    additionalProperties: false,
  },
  response: {
    204: { description: 'Session revoked successfully' },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: { message: { type: 'string' } },
      required: ['message'],
    },
  },
};
