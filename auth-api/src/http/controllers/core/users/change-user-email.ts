import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserAdmin } from '@/http/middlewares/verify-user-admin';
import { makeChangeUserEmailUseCase } from '@/use-cases/core/users/factories/make-change-user-email-use-case';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function changeUserEmail(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/users/:userId/email',
    preHandler: [verifyJwt, verifyUserAdmin],
    schema: {
      tags: ['Users'],
      summary: 'Change user email',
      params: z.object({
        userId: z.uuid(),
      }),
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
        404: z.object({
          message: z.string(),
        }),
      },
      required: ['userId  ', 'email'],
    },

    handler: async (request, reply) => {
      const { userId } = request.params;

      const { email } = request.body;

      try {
        const changeUserEmailUseCase = makeChangeUserEmailUseCase();

        await changeUserEmailUseCase.execute({ userId, email });

        return reply.status(200).send({ message: 'Email updated' });
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
