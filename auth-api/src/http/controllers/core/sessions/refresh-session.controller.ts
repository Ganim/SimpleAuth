import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { makeRefreshSessionUseCase } from '@/use-cases/core/sessions/factories/make-refresh-session-use-case';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function refreshSessionController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/sessions/refresh',
    preHandler: [verifyJwt],
    schema: {
      tags: ['Sessions'],
      summary: 'Refresh the current authenticated user session',
      response: {
        204: z.void(),
        400: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
    handler: async (request, reply) => {
      const userId = request.user?.sub;

      const { sessionId } = request.user;

      if (!sessionId) {
        return reply
          .status(400)
          .send({ message: 'Session ID is missing from token payload.' });
      }

      const ip = request.ip;

      try {
        const refreshSessionUseCase = makeRefreshSessionUseCase();

        await refreshSessionUseCase.execute({ sessionId, userId, ip, reply });

        return reply.status(204).send();
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
