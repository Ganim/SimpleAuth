import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found';
import { makeGetUserByIdUseCase } from '@/use-cases/core/users/factories/make-get-user-by-id-use-case';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function getUserById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/users/:userId',
    preHandler: [verifyJwt],
    schema: {
      tags: ['Users'],
      summary: 'Get user by ID',
      params: z.object({
        userId: z.uuid(),
      }),
      response: {
        200: z.object({
          user: z.object({
            id: z.string(),
            email: z.string(),
            username: z.string(),
            role: z.string(),
            lastLoginAt: z.coerce.date(),
          }),
          profile: z.object({
            id: z.string(),
            userId: z.string(),
            name: z.string(),
            surname: z.string(),
            birthday: z.coerce.date(),
            location: z.string(),
            bio: z.string(),
            avatarUrl: z.string(),
          }),
        }),
        404: z.object({
          message: z.string(),
        }),
      },
    },

    handler: async (request, reply) => {
      const { userId } = request.params;

      try {
        const getUserByIdUseCase = makeGetUserByIdUseCase();
        const { user, profile } = await getUserByIdUseCase.execute({ userId });
        return reply.status(200).send({ user, profile });
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        throw error;
      }
    },
  });
}
