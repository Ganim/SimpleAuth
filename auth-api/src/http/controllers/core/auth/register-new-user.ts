import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeCreateUserUseCase } from '@/use-cases/users/factories/make-create-user-use-case';

import z from 'zod';

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
            birthday: z.date().optional(),
            location: z.string().min(1).max(128).optional(),
            avatarUrl: z.string().min(1).max(512).optional(),
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
        400: z.object({
          message: z.string(),
        }),
      },
      required: ['email', 'password'],
    },

    handler: async (request, reply) => {
      const { email, password, username, profile } = request.body;

      try {
        const createUserUseCase = makeCreateUserUseCase();
        const { user, profile: createdProfile } =
          await createUserUseCase.execute({
            email,
            password,
            username,
            profile,
          });
        return reply.status(201).send({
          email: user.email,
          profile: createdProfile,
        });
      } catch (error) {
        if (error instanceof BadRequestError) {
          return reply.status(400).send({ message: error.message });
        }
        throw error;
      }
    },
  });
}
