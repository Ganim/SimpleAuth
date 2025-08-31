import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserAdmin } from '@/http/middlewares/verify-user-admin';
import { makeDeleteUserByIdUseCase } from '@/use-cases/core/users/factories/make-delete-user-by-id-use-case';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function DeleteUserById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/users/:userId',
    preHandler: [verifyJwt, verifyUserAdmin],
    schema: {
      tags: ['Users'],
      summary: 'Delete a user',
      params: z.object({
        userId: z.uuid(),
      }),
      response: {
        200: z.void(),
        404: z.object({
          message: z.string(),
        }),
      },
      required: ['userId'],
    },

    handler: async (request, reply) => {
      const { userId } = request.params;

      try {
        const DeleteUserByIdUseCase = makeDeleteUserByIdUseCase();
        await DeleteUserByIdUseCase.execute({ userId });
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
