import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { makeLogoutSessionUseCase } from '@/use-cases/core/sessions/factories/make-logout-session-use-case';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function logoutSessionController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/v1/sessions/logout',
    preHandler: [verifyJwt],
    schema: {
      tags: ['Sessions'],
      summary: 'Logout the current authenticated user session',
      response: {
        204: z.void(),
        404: z.object({ message: z.string() }),
      },
    },
    handler: async (request, reply) => {
      const { sessionId } = request.user;

      if (!sessionId) {
        return reply
          .status(400)
          .send({ message: 'Session ID is missing from token payload.' });
      }

      try {
        const logoutSession = makeLogoutSessionUseCase();
        await logoutSession.execute({
          sessionId,
        });

        return reply.status(204).send();
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        throw error;
      }
    },
  });
}
