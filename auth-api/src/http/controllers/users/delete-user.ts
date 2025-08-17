import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeDeleteUserUseCase } from '@/use-cases/users/factories/make-delete-user-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  try {
    const deleteUserUseCase = makeDeleteUserUseCase();
    await deleteUserUseCase.execute({ id });
    return reply.status(200).send({ message: 'User deleted' });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}
