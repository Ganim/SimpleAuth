import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { makeGetMyUserUseCase } from '@/use-cases/core/me/factories/make-get-my-user-use-case';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function getMyUserController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/me',
    preHandler: [verifyJwt],
    schema: {
      tags: ['Me'],
      summary: 'Get authenticated user',
      response: {
        200: z.object({
          user: z.object({
            id: z.string(),
            email: z.string(),
            username: z.string(),
            role: z.string(),
            lastLoginAt: z.coerce.date().nullable(),
            deletedAt: z.coerce.date().nullable().optional(),
            profile: z
              .object({
                id: z.string(),
                userId: z.string(),
                name: z.string(),
                surname: z.string(),
                birthday: z.coerce.date().optional(),
                location: z.string(),
                bio: z.string(),
                avatarUrl: z.string(),
                createdAt: z.coerce.date(),
                updatedAt: z.coerce.date().optional(),
              })
              .nullable()
              .optional(),
          }),
        }),
        404: z.object({
          message: z.string(),
        }),
      },
    },

    handler: async (request, reply) => {
      const userId = request.user.sub;

      try {
        const getMyUser = makeGetMyUserUseCase();
        const { user } = await getMyUser.execute({ userId });

        return reply.status(200).send({ user });
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        throw error;
      }
    },
  });
}
