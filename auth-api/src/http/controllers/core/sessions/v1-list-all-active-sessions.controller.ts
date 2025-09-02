import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserManager } from '@/http/middlewares/verify-user-manager';
import { makeListAllActiveSessionsUseCase } from '@/use-cases/core/sessions/factories/make-list-all-active-sessions-use-case';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function listAllActiveSessionsController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/v1/sessions/active',
    preHandler: [verifyJwt, verifyUserManager],
    schema: {
      tags: ['Sessions'],
      summary: 'List all active sessions',
      response: {
        200: z.object({ sessions: z.array(z.any()) }),
        404: z.object({ message: z.string() }),
      },
    },
    handler: async (request, reply) => {
      try {
        const listAllActiveSessions = makeListAllActiveSessionsUseCase();

        const { sessions } = await listAllActiveSessions.execute();

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
