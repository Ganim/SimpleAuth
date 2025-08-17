import { makeGetMyProfileUseCase } from '@/use-cases/auth/factories/make-get-my-profile-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function getMyProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getMyProfile = makeGetMyProfileUseCase();
  const { profile } = await getMyProfile.execute({
    userId: request.user.sub,
  });
  return reply.status(200).send({ profile });
}
