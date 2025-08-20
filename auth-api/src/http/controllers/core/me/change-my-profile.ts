import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeChangeMyProfileUseCase } from '@/use-cases/core/me/factories/make-change-my-profile-use-case';

import z from 'zod';

import { verifyJwt } from '@/http/middlewares/verify-jwt';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function changeMyProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/me',
    preHandler: [verifyJwt],
    schema: {
      tags: ['Me'],
      summary: 'Change self username by authenticated user',
      body: z.object({
        profile: z.object({
          name: z.string().optional(),
          surname: z.string().optional(),
          birthday: z.coerce.date().optional(),
          location: z.string().optional(),
          bio: z.string().optional(),
          avatarUrl: z.url().optional(),
        }),
      }),
      response: {
        200: z.object({
          profile: z.object({
            name: z.string().optional(),
            surname: z.string().optional(),
            birthday: z.coerce.date().optional(),
            location: z.string().optional(),
            bio: z.string().optional(),
            avatarUrl: z.url().optional(),
          }),
        }),
        400: z.object({
          message: z.string(),
        }),
      },
      required: ['profile'],
    },

    handler: async (request, reply) => {
      const userId = request.user.sub;

      const { profile } = request.body;

      try {
        const changeMyProfileUseCase = makeChangeMyProfileUseCase();

        const result = await changeMyProfileUseCase.execute({
          userId,
          profile,
        });

        return reply.status(200).send({ profile: result.profile });
      } catch (error) {
        if (error instanceof BadRequestError) {
          return reply.status(400).send({ message: error.message });
        }
        throw error;
      }
    },
  });
}
