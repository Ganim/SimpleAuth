import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserAdmin } from '@/http/middlewares/verify-user-admin';
import { makeChangeUserUsernameUseCase } from '@/use-cases/core/users/factories/make-change-user-username-use-case';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function changeUserUsername(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/users/:userId/username',
    preHandler: [verifyJwt, verifyUserAdmin],
    schema: {
      tags: ['Users'],
      summary: 'Change user username',
      params: z.object({
        userId: z.uuid(),
      }),
      body: z.object({
        username: z.string().min(3).max(30),
      }),
      response: {
        200: z.object({
          message: z.string(),
        }),
        400: z.object({
          message: z.string(),
        }),
        404: z.object({
          message: z.string(),
        }),
      },
      required: ['id', 'username'],
    },

    handler: async (request, reply) => {
      const { userId } = request.params;
      const { username } = request.body;

      try {
        const changeUserUsernameUseCase = makeChangeUserUsernameUseCase();

        await changeUserUsernameUseCase.execute({ userId, username });

        return reply.status(200).send({ message: 'Username updated' });
      } catch (error) {
        if (error instanceof BadRequestError) {
          return reply.status(400).send({ message: error.message });
        }
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        throw error;
      }
    },
  });
}
