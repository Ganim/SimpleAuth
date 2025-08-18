import { makeListMySessionsUseCase } from '@/use-cases/sessions/factories/make-list-my-sessions-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

// CONTROLLER
export async function listMySessionsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user?.sub;
  if (!userId) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }
  const listMySessions = makeListMySessionsUseCase();
  const { sessions } = await listMySessions.execute(userId);
  return reply.code(200).send({ sessions });
}

// ATTRIBUTES
export const listMySessionsSchema = {
  tags: ['Sessions'],
  summary: 'List my sessions',
  response: {
    200: {
      description: 'List of user sessions',
      type: 'object',
      properties: {
        sessions: { type: 'array', items: { type: 'object' } },
      },
      required: ['sessions'],
    },
    401: {
      description: 'Unauthorized',
      type: 'object',
      properties: { message: { type: 'string' } },
      required: ['message'],
    },
  },
};
