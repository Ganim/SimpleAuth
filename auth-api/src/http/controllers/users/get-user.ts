import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { makeGetUserUseCase } from '../../../use-cases/users/factories/make-get-user-use-case';

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  try {
    const getUserUseCase = makeGetUserUseCase();
    const { user, profile } = await getUserUseCase.execute({ id });
    return reply.status(200).send({ user, profile });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}
