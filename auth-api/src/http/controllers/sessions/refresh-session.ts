import { makeRefreshSessionUseCase } from '@/use-cases/sessions/factories/make-refresh-session-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const refreshSessionBodySchema = z.object({
  sessionId: z.string(),
});

// CONTROLLER
export async function refreshSessionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sessionId } = refreshSessionBodySchema.parse(request.body);
  const ip = request.ip ?? request.headers['x-forwarded-for'] ?? '';
  if (!sessionId) {
    return reply.code(400).send({ message: 'Session ID is required' });
  }
  const refreshSessionUseCase = makeRefreshSessionUseCase();
  await refreshSessionUseCase.execute(sessionId, ip);
  return reply.code(204).send();
}

// ATTRIBUTES
export const refreshSessionSchema = {
  tags: ['Sessions'],
  summary: 'Refresh session info',
  body: {
    type: 'object',
    properties: {
      sessionId: { type: 'string', description: 'Session ID to refresh' },
    },
    required: ['sessionId'],
    additionalProperties: false,
  },
  response: {
    204: { description: 'Session info refreshed successfully' },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: { message: { type: 'string' } },
      required: ['message'],
    },
  },
};
