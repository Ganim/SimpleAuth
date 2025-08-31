import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserManager } from '@/http/middlewares/verify-user-manager';
import { makeListUserSessionsUseCase } from '@/use-cases/core/sessions/factories/make-list-user-sessions-use-case';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function listUserSessionsController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/sessions/user/:userId',
    preHandler: [verifyJwt, verifyUserManager],
    schema: {
      tags: ['Sessions'],
      summary: 'List sessions by user',
      params: z.object({ userId: z.uuid() }),
      response: {
        200: z.object({ sessions: z.array(z.any()) }),
        404: z.object({ message: z.string() }),
      },
    },
    handler: async (request, reply) => {
      const { userId } = request.params;

      try {
        const listUserSessions = makeListUserSessionsUseCase();

        const { sessions } = await listUserSessions.execute({ userId });

        return reply.status(200).send({ sessions });
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        throw error;
      }
    },
  });
}
