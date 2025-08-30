import { makeListMySessionsUseCase } from '@/use-cases/core/sessions/factories/make-list-my-sessions-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function listMySessionsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Tipagem correta do JWT (FastifyJWT já estende o tipo)
  const userId = request.user?.sub;
  if (!userId) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  // Ideal: sessionsRepository via DI (exemplo: request.di.sessionsRepository)
  // Aqui mantido InMemory para exemplo
  const listMySessions = makeListMySessionsUseCase();
  const { sessions } = await listMySessions.execute(userId);
  return reply.code(200).send({ sessions });
}
