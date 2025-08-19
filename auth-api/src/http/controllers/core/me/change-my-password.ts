import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeChangeMyPasswordUseCase } from '@/use-cases/core/me/factories/make-change-my-password-use-case';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function changeMyPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/me/password',
    preHandler: [verifyJwt],
    schema: {
      tags: ['Me'],
      summary: 'Change self password by authenticated user',
      body: z.object({
        password: z.string().min(6),
      }),
      response: {
        200: z.object({
          message: z.string(),
        }),
        400: z.object({
          message: z.string(),
        }),
      },
      required: ['password'],
    },

    handler: async (request, reply) => {
      const userId = request.user.sub;

      const { password } = request.body;

      try {
        const changeMyPasswordUseCase = makeChangeMyPasswordUseCase();

        await changeMyPasswordUseCase.execute({ userId, password });

        return reply.status(200).send({ message: 'Password updated' });
      } catch (error) {
        if (error instanceof BadRequestError) {
          return reply.status(400).send({ message: error.message });
        }
        throw error;
      }
    },
  });
}
