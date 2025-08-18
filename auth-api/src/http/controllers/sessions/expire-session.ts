import { makeExpireSessionUseCase } from '@/use-cases/sessions/factories/make-expire-session-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const expireSessionBodySchema = z.object({
  sessionId: z.string(),
});

// CONTROLLER
export async function expireSessionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sessionId } = expireSessionBodySchema.parse(request.body);
  const expireSession = makeExpireSessionUseCase();
  await expireSession.execute(sessionId);
  return reply.code(204).send();
}

// ATTRIBUTES
export const expireSessionSchema = {
  tags: ['Sessions'],
  summary: 'Expire a session',
  body: {
    type: 'object',
    properties: {
      sessionId: { type: 'string', description: 'Session ID to expire' },
    },
    required: ['sessionId'],
    additionalProperties: false,
  },
  response: {
    204: { description: 'Session expired successfully' },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: { message: { type: 'string' } },
      required: ['message'],
    },
  },
};
