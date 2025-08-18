import { makeListUserSessionsByDateUseCase } from '@/use-cases/sessions/factories/make-list-user-sessions-by-date-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const listUserSessionsByDateQuerySchema = z.object({
  userId: z.string(),
  from: z.string(),
  to: z.string(),
});

// CONTROLLER
export async function listUserSessionsByDateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userId, from, to } = listUserSessionsByDateQuerySchema.parse(
    request.query,
  );
  const listUserSessionsByDate = makeListUserSessionsByDateUseCase();
  const result = await listUserSessionsByDate.execute(
    userId,
    new Date(from),
    new Date(to),
  );
  return reply.code(200).send(result);
}

// ATTRIBUTES
export const listUserSessionsByDateSchema = {
  tags: ['Sessions'],
  summary: 'List user sessions by date',
  querystring: {
    type: 'object',
    properties: {
      userId: { type: 'string', description: 'User ID' },
      from: { type: 'string', format: 'date-time', description: 'Start date' },
      to: { type: 'string', format: 'date-time', description: 'End date' },
    },
    required: ['userId', 'from', 'to'],
    additionalProperties: false,
  },
  response: {
    200: {
      description: 'List of sessions in date range',
      type: 'object',
      properties: {
        sessions: { type: 'array', items: { type: 'object' } },
      },
      required: ['sessions'],
    },
  },
};
