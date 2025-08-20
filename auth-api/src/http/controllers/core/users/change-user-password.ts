import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserAdmin } from '@/http/middlewares/verify-user-admin';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found';
import { makeChangeUserPasswordUseCase } from '@/use-cases/core/users/factories/make-change-user-password-use-case';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function changeUserPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/users/:userId/password',
    preHandler: [verifyJwt, verifyUserAdmin],
    schema: {
      tags: ['Users'],
      summary: 'Change user password',
      params: z.object({
        userId: z.uuid(),
      }),
      body: z.object({
        password: z.string().min(6),
      }),
      response: {
        200: z.object({
          message: z.string(),
        }),
        404: z.object({
          message: z.string(),
        }),
      },
      required: ['userId', 'password'],
    },

    handler: async (request, reply) => {
      const { userId } = request.params;
      const { password } = request.body;

      try {
        const changeUserPasswordUseCase = makeChangeUserPasswordUseCase();

        await changeUserPasswordUseCase.execute({ userId, password });

        return reply.status(200).send({ message: 'Password updated' });
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        throw error;
      }
    },
  });
}
