import { PrismaSessionsRepository } from '@/repositories/prisma/prisma-sessions-repository';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

type JwtPayload = { sub: string; role: string; sessionId?: string };

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
        400: z.object({
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
        return reply.status(400).send({ message: 'Session ID is required' });
      }

      const sessionsRepository = new PrismaSessionsRepository();
      await sessionsRepository.updateSessionInfo(sessionId, ip);

      const token = await reply.jwtSign(
        { role: request.user.role, sessionId },
        { sign: { sub: request.user.sub } },
      );

      const refreshToken = await reply.jwtSign(
        { role: request.user.role, sessionId },
        { sign: { sub: request.user.sub, expiresIn: '7d' } },
      );

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
