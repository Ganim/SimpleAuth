import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserAdmin } from '@/http/middlewares/verify-user-admin';
import { makeChangeUserProfileUseCase } from '@/use-cases/core/users/factories/make-change-user-profile-use-case';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function changeUserProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/users/:userId',
    preHandler: [verifyJwt, verifyUserAdmin],
    schema: {
      tags: ['Users'],
      summary: 'Change user profile',
      params: z.object({
        userId: z.uuid(),
      }),
      body: z.object({
        profile: z.object({
          name: z.string().optional(),
          surname: z.string().optional(),
          birthday: z.coerce.date().optional(),
          location: z.string().optional(),
          bio: z.string().optional(),
          avatarUrl: z.url().optional(),
        }),
      }),
      response: {
        200: z.object({
          profile: z.object({
            name: z.string().optional(),
            surname: z.string().optional(),
            birthday: z.coerce.date().optional(),
            location: z.string().optional(),
            bio: z.string().optional(),
            avatarUrl: z.url().optional(),
          }),
        }),
        404: z.object({
          message: z.string(),
        }),
      },
      required: ['userId', 'profile'],
    },

    handler: async (request, reply) => {
      const { userId } = request.params;

      const { profile } = request.body;

      try {
        const changeUserProfileUseCase = makeChangeUserProfileUseCase();

        const result = await changeUserProfileUseCase.execute({
          userId,
          profile,
        });

        return reply.status(200).send({ profile: result.profile });
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        throw error;
      }
    },
  });
}
