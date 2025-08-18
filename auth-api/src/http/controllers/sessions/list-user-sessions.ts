import { makeListUserSessionsUseCase } from '@/use-cases/sessions/factories/make-list-user-sessions-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const listUserSessionsParamsSchema = z.object({
  userId: z.string(),
});

// CONTROLLER
export async function listUserSessionsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userId } = listUserSessionsParamsSchema.parse(request.params);
  const listUserSessions = makeListUserSessionsUseCase();
  const result = await listUserSessions.execute(userId);
  return reply.code(200).send(result);
}

// ATTRIBUTES
export const listUserSessionsSchema = {
  tags: ['Sessions'],
  summary: 'List sessions for a user',
  params: {
    type: 'object',
    properties: {
      userId: { type: 'string', description: 'User ID' },
    },
    required: ['userId'],
    additionalProperties: false,
  },
  response: {
    200: {
      description: 'List of user sessions',
      type: 'object',
      properties: {
        sessions: { type: 'array', items: { type: 'object' } },
      },
      required: ['sessions'],
    },
  },
};
