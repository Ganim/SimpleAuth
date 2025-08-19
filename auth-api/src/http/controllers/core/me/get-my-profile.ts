import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { makeGetMyProfileUseCase } from '@/use-cases/core/me/factories/make-get-my-profile-use-case';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function getMyProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/me',
    preHandler: [verifyJwt],
    schema: {
      tags: ['Me'],
      summary: 'Get authenticated user profile',
      response: {
        200: z.object({
          profile: z.object({
            id: z.string(),
            userId: z.string(),
            name: z.string(),
            surname: z.string(),
            location: z.string(),
            birthday: z.string(),
            bio: z.string(),
            avatarUrl: z.string(),
            email: z.string(),
            username: z.string(),
          }),
        }),
        400: z.object({
          message: z.string(),
        }),
      },
    },

    handler: async (request, reply) => {
      const userId = request.user.sub;

      try {
        const getMyProfile = makeGetMyProfileUseCase();
        const { profile } = await getMyProfile.execute({ userId });
        // Garante que location nunca será null
        const safeProfile = {
          ...profile,
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
    },
  });
}
