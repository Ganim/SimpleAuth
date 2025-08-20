import { makeRefreshTokenUseCase } from '@/use-cases/core/auth/factories/make-refresh-token-use-case';
import { type JwtPayload } from '@/use-cases/core/auth/refresh-token';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function refreshToken(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/auth/refresh',
    schema: {
      tags: ['Auth'],
      summary: 'Refresh access token',
      body: z.object({
        sessionId: z.string().optional(),
      }),
      response: {
        200: z.object({
          token: z.string(),
        }),
        404: z.object({
          message: z.string(),
        }),
      },
    },

    handler: async (request, reply) => {
      await request.jwtVerify();

      const sessionId =
        request.cookies.sessionId ||
        request.body?.sessionId ||
        (request.user as JwtPayload)?.sessionId;
      const ip = request.ip ?? request.headers['x-forwarded-for'] ?? '';

      if (!sessionId) {
        return reply.status(404).send({ message: 'Session ID is required' });
      }

      const refreshTokenUseCase = makeRefreshTokenUseCase();

      const { token, refreshToken } = await refreshTokenUseCase.execute({
        sessionId,
        ip,
        user: {
          sub: request.user.sub,
          role: request.user.role,
        },
        reply,
      });

      return reply
        .setCookie('refreshToken', refreshToken, {
          path: '/',
          secure: true,
          sameSite: true,
          httpOnly: true,
        })
        .status(200)
        .send({ token });
    },
  });
}
