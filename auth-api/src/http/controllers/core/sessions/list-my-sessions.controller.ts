import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { makeListMySessionsUseCase } from '@/use-cases/core/sessions/factories/make-list-my-sessions-use-case';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function listMySessionsController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/sessions/me',
    preHandler: [verifyJwt],
    schema: {
      tags: ['Sessions'],
      summary: 'List my sessions',
      response: {
        200: z.object({ sessions: z.array(z.any()) }),
        401: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
    handler: async (request, reply) => {
      const userId = request.user?.sub;

      try {
        const listMySessions = makeListMySessionsUseCase();

        const { sessions } = await listMySessions.execute({ userId });

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
