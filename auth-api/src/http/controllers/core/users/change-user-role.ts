import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserAdmin } from '@/http/middlewares/verify-user-admin';
import { makeChangeUserRoleUseCase } from '@/use-cases/core/users/factories/make-change-user-role-use-case';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function changeUserRole(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/users/:userId/role',
    preHandler: [verifyJwt, verifyUserAdmin],
    schema: {
      tags: ['Users'],
      summary: 'Change user role',
      params: z.object({
        userId: z.uuid(),
      }),
      body: z.object({
        role: z.enum(['USER', 'MANAGER', 'ADMIN']),
      }),
      response: {
        200: z.object({
          message: z.string(),
        }),
        404: z.object({
          message: z.string(),
        }),
      },
      required: ['userId', 'role'],
    },

    handler: async (request, reply) => {
      const { userId } = request.params;
      const { role } = request.body;

      try {
        const changeUserRoleUseCase = makeChangeUserRoleUseCase();

        await changeUserRoleUseCase.execute({ userId, role });

        return reply.status(200).send({ message: 'Role updated' });
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        throw error;
      }
    },
  });
}
