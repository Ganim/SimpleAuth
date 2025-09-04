import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserAdmin } from '@/http/middlewares/verify-user-admin';
import { makeChangeUserEmailUseCase } from '@/use-cases/core/users/factories/make-change-user-email-use-case';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function changeUserEmailController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/v1/users/:userId/email',
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
        400: z.object({
          message: z.string(),
        }),
        404: z.object({
          message: z.string(),
        }),
      },
      required: ['userId', 'email'],
    },

    handler: async (request, reply) => {
      const { userId } = request.params;

      const { email } = request.body;

      try {
        const changeUserEmailUseCase = makeChangeUserEmailUseCase();

        const { user } = await changeUserEmailUseCase.execute({
          userId,
          email,
        });

        return reply.status(200).send({ user });
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
