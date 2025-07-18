import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { makeDeleteProfileUseCase } from '../../../use-cases/auth/factories/make-delete-profile-use-case';
import { makeDeleteUserUseCase } from '../../../use-cases/users/factories/make-delete-user-use-case';

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  try {
    const deleteProfileUseCase = makeDeleteProfileUseCase();
    await deleteProfileUseCase.execute({ userId: id });
    const deleteUserUseCase = makeDeleteUserUseCase();
    await deleteUserUseCase.execute({ id });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }

  return reply.status(200).send({ message: 'User and profile deleted' });
}
