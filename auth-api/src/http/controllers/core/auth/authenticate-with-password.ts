import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeAuthenticateWithPasswordUseCase } from '@/use-cases/core/auth/factories/make-authenticate-with-password-use-case';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/auth/password',
    schema: {
      tags: ['Auth'],
      summary: 'Authenticate user with email and password',
      body: z.object({
        email: z.email(),
        password: z.string().min(6),
      }),
      response: {
        200: z.object({
          token: z.string(),
          sessionId: z.string(),
        }),
        400: z.object({
          message: z.string(),
        }),
      },
      required: ['email', 'password'],
    },

    handler: async (request, reply) => {
      const { email, password } = request.body;

      const ip = request.ip ?? request.headers['x-forwarded-for'] ?? '';

      try {
        const authenticateUseCase = makeAuthenticateWithPasswordUseCase();

        const { user, sessionId } = await authenticateUseCase.execute({
          email,
          password,
          ip,
        });

        const token = await reply.jwtSign(
          { role: user.role, sessionId },
          { sign: { sub: user.id } },
        );

        const refreshToken = await reply.jwtSign(
          { role: user.role, sessionId },
          { sign: { sub: user.id, expiresIn: '7d' } },
        );
        return reply
          .setCookie('refreshToken', refreshToken, {
            path: '/',
            secure: true,
            sameSite: true,
            httpOnly: true,
          })
          .status(200)
          .send({ token, sessionId });
      } catch (error) {
        if (error instanceof BadRequestError) {
          return reply.status(400).send({ message: error.message });
        }
        throw error;
      }
    },
  });
}
