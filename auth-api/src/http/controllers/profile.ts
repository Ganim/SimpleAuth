import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-profile-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase();

  const { profile } = await getUserProfile.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({ profile });
}
