import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeChangeMyEmailUseCase } from '@/use-cases/core/me/factories/make-change-my-email-use-case';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function changeMyEmail(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/me/email',
    preHandler: [verifyJwt],
    schema: {
      tags: ['Me'],
      summary: 'Change self email by authenticated user',
      body: z.object({
        email: z.email(),
      }),
      response: {
        200: z.object({
          message: z.string(),
        }),
        400: z.object({
          message: z.string(),
        }),
      },
      required: ['email'],
    },

    handler: async (request, reply) => {
      const userId = request.user.sub;

      const { email } = request.body;

      try {
        const changeMyEmailUseCase = makeChangeMyEmailUseCase();

        await changeMyEmailUseCase.execute({ userId, email });

        return reply.status(200).send({ message: 'Email updated' });
      } catch (error) {
        if (error instanceof BadRequestError) {
          return reply.status(400).send({ message: error.message });
        }
        throw error;
      }
    },
  });
}
