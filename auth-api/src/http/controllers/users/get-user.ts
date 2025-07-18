import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeGetUserProfileUseCase } from '@/use-cases/auth/factories/make-get-profile-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { makeGetUserUseCase } from '../../../use-cases/users/factories/make-get-user-use-case';

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  try {
    const getUserUseCase = makeGetUserUseCase();
    const { user } = await getUserUseCase.execute({ id });
    const getProfileUseCase = makeGetUserProfileUseCase();
    const { profile } = await getProfileUseCase.execute({ userId: id });
    return reply.status(200).send({ user, profile });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}
