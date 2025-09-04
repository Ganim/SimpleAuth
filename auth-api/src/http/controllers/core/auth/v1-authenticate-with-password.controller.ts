import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UserBlockedError } from '@/@errors/use-cases/user-blocked-error';
import { makeAuthenticateWithPasswordUseCase } from '@/use-cases/core/auth/factories/make-authenticate-with-password-use-case';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function authenticateWithPasswordController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/v1/auth/login/password',
    schema: {
      tags: ['Auth'],
      summary: 'Authenticate user with email and password',
      body: z.object({
        email: z.email(),
        password: z.string().min(6),
      }),
      response: {
        200: z.object({
          user: z.object({
            id: z.string(),
            email: z.string(),
            username: z.string(),
            role: z.string(),
            lastLoginAt: z.coerce.date().nullable(),
            deletedAt: z.coerce.date().nullable().optional(),
            profile: z
              .object({
                id: z.string(),
                userId: z.string(),
                name: z.string(),
                surname: z.string(),
                birthday: z.coerce.date().optional(),
                location: z.string(),
                bio: z.string(),
                avatarUrl: z.string(),
                createdAt: z.coerce.date(),
                updatedAt: z.coerce.date().optional(),
              })
              .nullable()
              .optional(),
          }),
          sessionId: z.string(),
          token: z.string(),
          refreshToken: z.string(),
        }),
        400: z.object({ message: z.string() }),
        403: z.object({ message: z.string(), blockedUntil: z.coerce.date() }),
        404: z.object({ message: z.string() }),
      },
      required: ['email', 'password'],
    },

    handler: async (request, reply) => {
      const { email, password } = request.body;

      const ip = request.ip;

      try {
        const authenticateUseCase = makeAuthenticateWithPasswordUseCase();

        const { user, sessionId, token, refreshToken } =
          await authenticateUseCase.execute({
            email,
            password,
            ip,
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
          .send({ user, sessionId, token, refreshToken });
      } catch (error) {
        if (error instanceof BadRequestError) {
          return reply.status(400).send({ message: error.message });
        }
        if (error instanceof UserBlockedError) {
          return reply.status(403).send({
            message: error.message,
            blockedUntil: error.blockedUntil, //
          });
        }
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        throw error;
      }
    },
  });
}
