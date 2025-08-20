import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found';

import z from 'zod';

import { makeRegisterNewUserUseCase } from '@/use-cases/core/auth/factories/make-register-new-user-use-case';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function registerNewUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/register',
    schema: {
      tags: ['Auth'],
      summary: 'Register a new user',
      body: z.object({
        email: z.email(),
        password: z.string().min(6),
        username: z.string().min(3).max(30).optional(),
        profile: z
          .object({
            name: z.string().min(1).max(50).optional(),
            surname: z.string().min(1).max(50).optional(),
            birthday: z.coerce.date().optional(),
            location: z.string().min(1).max(128).optional(),
          })
          .optional(),
      }),
      response: {
        201: z.object({
          email: z.email(),
          profile: z.object({
            id: z.string(),
            userId: z.string(),
            name: z.string(),
            surname: z.string(),
            location: z.string(),
            birthday: z.date().nullable(),
            bio: z.string(),
            avatarUrl: z.string(),
          }),
        }),
        404: z.object({
          message: z.string(),
        }),
      },
      required: ['email', 'password'],
    },

    handler: async (request, reply) => {
      const { email, password, username, profile } = request.body;

      try {
        const registerNewUserUseCase = makeRegisterNewUserUseCase();
        const { user, profile: newUserProfile } =
          await registerNewUserUseCase.execute({
            email,
            password,
            username,
            profile,
          });
        return reply.status(201).send({
          email: user.email,
          profile: newUserProfile,
        });
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        throw error;
      }
    },
  });
}
