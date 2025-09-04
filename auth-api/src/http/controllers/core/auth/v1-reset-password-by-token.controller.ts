import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { makeResetPasswordByTokenUseCase } from '@/use-cases/core/auth/factories/make-reset-password-by-token-use-case';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function resetPasswordByTokenController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/v1/auth/reset/password',
    schema: {
      tags: ['Auth'],
      summary: 'Reset password using recovery token',
      body: z.object({
        token: z.string(),
        password: z.string().min(6),
      }),
      response: {
        200: z.object({ message: z.string() }),
        400: z.object({ message: z.string() }),
      },
    },
    handler: async (request, reply) => {
      const { token, password } = request.body;
      try {
        const useCase = makeResetPasswordByTokenUseCase();
        await useCase.execute({ token, password });
        return reply
          .status(200)
          .send({ message: 'Password reset successfully.' });
      } catch (error) {
        if (error instanceof BadRequestError) {
          return reply.status(400).send({ message: error.message });
        }
        throw error;
      }
    },
  });
}
