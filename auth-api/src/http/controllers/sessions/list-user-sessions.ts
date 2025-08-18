import { makeListUserSessionsUseCase } from '@/use-cases/sessions/factories/make-list-user-sessions-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function listUserSessionsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userId } = request.params as { userId: string };
  const listUserSessions = makeListUserSessionsUseCase();
  const result = await listUserSessions.execute(userId);
  return reply.code(200).send(result);
}
