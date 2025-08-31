import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserManager } from '@/http/middlewares/verify-user-manager';
import { makeRevokeSessionUseCase } from '@/use-cases/core/sessions/factories/make-revoke-session-use-case';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function revokeSessionController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/sessions/:sessionId/revoke',
    preHandler: [verifyJwt, verifyUserManager],
    schema: {
      tags: ['Sessions'],
      summary: 'Revoke session',
      params: z.object({ sessionId: z.uuid() }),
      response: {
        204: z.void(),
        400: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
    handler: async (request, reply) => {
      const { sessionId } = request.params;

      try {
        const revokeSession = makeRevokeSessionUseCase();

        await revokeSession.execute({ sessionId });

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
