import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function healthCheckController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/health',
    schema: {
      tags: ['Health'],
      summary: 'Checks the health of the API and database',
      response: {
        200: z.object({
          status: z.string(),
          database: z.string(),
        }),
        503: z.object({
          status: z.string(),
          database: z.string(),
          error: z.string().optional(),
        }),
      },
    },
    handler: async (request, reply) => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        return reply.status(200).send({
          status: 'ok',
          database: 'healthy',
        });
      } catch (error) {
        console.error('Health check failed:', error);
        return reply.status(503).send({
          status: 'error',
          database: 'unhealthy',
          error: 'Failed to connect to the database.',
        });
      }
    },
  });
}
