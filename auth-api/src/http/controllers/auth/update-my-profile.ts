import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeUpdateMyProfileUseCase } from '@/use-cases/auth/factories/make-update-my-profile-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const updateMyProfileBodySchema = z.object({
  name: z.string().optional(),
  surname: z.string().optional(),
  birthday: z.coerce.date().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
});

// CONTROLLER
export async function updateMyProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub;
  const body = updateMyProfileBodySchema.parse(request.body);
  try {
    const updateMyProfileUseCase = makeUpdateMyProfileUseCase();
    const { profile } = await updateMyProfileUseCase.execute({
      userId,
      ...body,
    });
    return reply.status(200).send({ profile });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}

// ATTRIBUTES
export const updateMyProfileSchema = {
  tags: ['User'],
  summary: 'Update authenticated user profile',
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'User name' },
      surname: { type: 'string', description: 'User surname' },
      birthday: {
        type: 'string',
        format: 'date-time',
        description: 'User birthday',
      },
      location: { type: 'string', description: 'User location' },
      bio: { type: 'string', description: 'User bio' },
      avatarUrl: { type: 'string', description: 'User avatar URL' },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      description: 'Profile updated',
      type: 'object',
      properties: {
        profile: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            surname: { type: 'string' },
            location: { type: 'string' },
            birthday: { type: 'string' },
            bio: { type: 'string' },
            avatarUrl: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
      },
      required: ['profile'],
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
      required: ['message'],
    },
  },
};
