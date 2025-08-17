import { makeGetMyProfileUseCase } from '@/use-cases/auth/factories/make-get-my-profile-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function getMyProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getMyProfile = makeGetMyProfileUseCase();
  try {
    const { profile } = await getMyProfile.execute({
      userId: request.user.sub,
    });
    const safeProfile = {
      ...profile,
      name: profile.name ?? '',
      surname: profile.surname ?? '',
      location: profile.location ?? '',
    };
    return reply.status(200).send({ profile: safeProfile });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'Profile not found' ||
        error.message === 'User not found')
    ) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}
