import { makeListUserSessionsByDateUseCase } from '@/use-cases/sessions/factories/make-list-user-sessions-by-date-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function listUserSessionsByDateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userId, from, to } = request.query as {
    userId: string;
    from: string;
    to: string;
  };
  const listUserSessionsByDate = makeListUserSessionsByDateUseCase();
  const result = await listUserSessionsByDate.execute(
    userId,
    new Date(from),
    new Date(to),
  );
  return reply.code(200).send(result);
}
