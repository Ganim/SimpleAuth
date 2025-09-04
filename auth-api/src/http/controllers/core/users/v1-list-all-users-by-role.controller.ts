import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserAdmin } from '@/http/middlewares/verify-user-admin';
import { makeListAllUsersByRoleUseCase } from '@/use-cases/core/users/factories/make-list-all-users-by-role-use-case';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function listAllUsersByRoleController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/v1/users/role/:role',
    preHandler: [verifyJwt, verifyUserAdmin],
    schema: {
      tags: ['Users'],
      summary: 'List all users by role',
      params: z.object({
        role: z.enum(['USER', 'MANAGER', 'ADMIN']),
      }),
      response: {
        200: z.object({
          users: z.array(
            z.object({
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
          ),
        }),
        400: z.object({
          message: z.string(),
        }),
        404: z.object({
          message: z.string(),
        }),
      },
    },

    handler: async (request, reply) => {
      const { role } = request.params;

      try {
        const listAllUsersByRoleUseCase = makeListAllUsersByRoleUseCase();
        const { users } = await listAllUsersByRoleUseCase.execute({ role });
        return reply.status(200).send({ users });
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
