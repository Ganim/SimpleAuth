import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserAdmin } from '@/http/middlewares/verify-user-admin';
import { makeChangeUserUsernameUseCase } from '@/use-cases/core/users/factories/make-change-user-username-use-case';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function changeUserUsernameController(app: FastifyInstance) {
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
      required: ['id', 'username'],
    },

    handler: async (request, reply) => {
      const { userId } = request.params;
      const { username } = request.body;

      try {
        const changeUserUsernameUseCase = makeChangeUserUsernameUseCase();

        const { user } = await changeUserUsernameUseCase.execute({
          userId,
          username,
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
