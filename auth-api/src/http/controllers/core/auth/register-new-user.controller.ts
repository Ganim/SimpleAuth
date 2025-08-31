import z from 'zod';

import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { makeRegisterNewUserUseCase } from '@/use-cases/core/auth/factories/make-register-new-user-use-case';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function registerNewUserController(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/register',
    schema: {
      tags: ['Auth'],
      summary: 'Register a new user',
      body: z.object({
        username: z.string().min(3).max(30).optional(),
        email: z.email(),
        password: z.string().min(6),
        profile: z
          .object({
            name: z.string().min(1).max(50).optional(),
            surname: z.string().min(1).max(50).optional(),
            birthday: z.coerce.date().optional(),
            location: z.string().min(1).max(128).optional(),
            bio: z.string().min(1).max(128).optional(),
            avatarUrl: z.url().optional(),
          })
          .optional(),
      }),
      response: {
        201: z.object({
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
        }),
        400: z.object({
          message: z.string(),
        }),
      },
    },

    handler: async (request, reply) => {
      const { email, password, username, profile } = request.body;

      try {
        const registerNewUserUseCase = makeRegisterNewUserUseCase();
        const { user } = await registerNewUserUseCase.execute({
          email,
          password,
          username,
          profile,
        });

        return reply.status(201).send({ user });
      } catch (error) {
        if (error instanceof BadRequestError) {
          return reply.status(400).send({ message: error.message });
        }
        throw error;
      }
    },
  });
}
