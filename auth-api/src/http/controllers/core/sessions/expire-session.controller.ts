import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserManager } from '@/http/middlewares/verify-user-manager';
import { makeExpireSessionUseCase } from '@/use-cases/core/sessions/factories/make-expire-session-use-case';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function expireSessionController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/sessions/:sessionId/expire',
    preHandler: [verifyJwt, verifyUserManager],
    schema: {
      tags: ['Sessions'],
      summary: 'Expire session by ID',
      params: z.object({
        sessionId: z.uuid(),
      }),
      response: {
        204: z.void(),
        404: z.object({ message: z.string() }),
      },
      required: ['sessionId'],
    },
    handler: async (request, reply) => {
      const { sessionId } = request.params;

      try {
        const expireSessionUseCase = makeExpireSessionUseCase();

        await expireSessionUseCase.execute({ sessionId });

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
