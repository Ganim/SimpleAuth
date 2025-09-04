import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { makeDeleteMyUserUseCase } from '@/use-cases/core/me/factories/make-delete-my-user-use-case';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function deleteMyUserController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/v1/me',
    preHandler: [verifyJwt],
    schema: {
      tags: ['Me'],
      summary: 'Delete authenticated user',
      response: {
        200: z.void(),
        404: z.object({
          message: z.string(),
        }),
      },
    },

    handler: async (request, reply) => {
      const userId = request.user.sub;

      try {
        const deleteMyUserUseCase = makeDeleteMyUserUseCase();
        await deleteMyUserUseCase.execute({ userId });
        return reply.status(200).send();
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        throw error;
      }
    },
  });
}
