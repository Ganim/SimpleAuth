import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found';
import { makeChangeMyUsernameUseCase } from '@/use-cases/core/me/factories/make-change-my-username-use-case';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function changeMyUsername(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/me/username',
    preHandler: [verifyJwt],
    schema: {
      tags: ['Me'],
      summary: 'Change self username by authenticated user',
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
      },
      required: ['username'],
    },

    handler: async (request, reply) => {
      const userId = request.user.sub;

      const { username } = request.body;

      try {
        const changeMyUsernameUseCase = makeChangeMyUsernameUseCase();

        await changeMyUsernameUseCase.execute({ userId, username });

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
