import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { verifyJwt } from '@/http/middlewares/verify-jwt';

import { verifyUserManager } from '@/http/middlewares/verify-user-manager';
import { makeListAllUsersUseCase } from '@/use-cases/core/users/factories/make-list-all-users-use-case';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function listAllUsers(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/users',
    preHandler: [verifyJwt, verifyUserManager],
    schema: {
      tags: ['Users'],
      summary: 'List all users',
      response: {
        200: z.object({
          users: z.array(
            z.object({
              id: z.string(),
              email: z.string(),
              username: z.string(),
              role: z.string(),
              lastLoginAt: z.date(),
              profile: z.object({
                name: z.string(),
                surname: z.string(),
                birthday: z.date(),
                location: z.string(),
                bio: z.string(),
                avatarUrl: z.string(),
              }),
            }),
          ),
        }),
        404: z.object({
          message: z.string(),
        }),
      },
    },

    handler: async (_, reply) => {
      try {
        const listAllUsersUseCase = makeListAllUsersUseCase();
        const { users } = await listAllUsersUseCase.execute();
        return reply.status(200).send({ users });
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        throw error;
      }
    },
  });
}
