import { makeListAllActiveSessionsUseCase } from '@/use-cases/sessions/factories/make-list-all-active-sessions-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

// CONTROLLER
export async function listAllActiveSessionsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listAllActiveSessions = makeListAllActiveSessionsUseCase();
  const result = await listAllActiveSessions.execute();
  return reply.code(200).send(result);
}

// ATTRIBUTES
export const listAllActiveSessionsSchema = {
  tags: ['Sessions'],
  summary: 'List all active sessions',
  response: {
    200: {
      description: 'List of active sessions',
      type: 'object',
      properties: {
        sessions: { type: 'array', items: { type: 'object' } },
      },
      required: ['sessions'],
    },
  },
};
