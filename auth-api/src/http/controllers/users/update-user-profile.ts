import { PrismaProfilesRepository } from '@/repositories/prisma/prisma-profiles-repository';
import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { UpdateUserProfileUseCase } from '@/use-cases/users/update-user-profile';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const updateUserProfileBodySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  surname: z.string().min(1).max(50).optional(),
  birthday: z.coerce.date().optional(),
  location: z.string().max(128).optional(),
  bio: z.string().max(255).optional(),
  avatarUrl: z.string().url().optional(),
});
export const updateUserProfileParamsSchema = z.object({
  id: z.string(),
});

// CONTROLLER
export async function updateUserProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateUserProfileParamsSchema.parse(request.params);
  const body = updateUserProfileBodySchema.parse(request.body);
  try {
    const profilesRepository = new PrismaProfilesRepository();
    const updateUserProfileUseCase = new UpdateUserProfileUseCase(
      profilesRepository,
    );
    const { profile } = await updateUserProfileUseCase.execute({
      userId: id,
      ...body,
    });
    return reply.status(200).send({
      message: 'User profile updated',
      profile,
    });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    if (error instanceof Error && error.message === 'Profile not found') {
      return reply.status(400).send({ message: 'User not found' });
    }
    return reply.status(400).send({ message: 'User not found' });
  }
}

// ATTRIBUTES
export const updateUserProfileSchema = {
  tags: ['Users'],
  summary: 'Update user profile',
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'User ID' },
    },
    required: ['id'],
    additionalProperties: false,
  },
  body: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
        description: 'Name',
      },
      surname: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
        description: 'Surname',
      },
      birthday: { type: 'string', format: 'date', description: 'Birthday' },
      location: { type: 'string', maxLength: 128, description: 'Location' },
      bio: { type: 'string', maxLength: 255, description: 'Bio' },
      avatarUrl: { type: 'string', format: 'url', description: 'Avatar URL' },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      description: 'User profile updated',
      type: 'object',
      properties: {
        message: { type: 'string' },
        profile: { type: 'object' },
      },
      required: ['message', 'profile'],
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: { message: { type: 'string' } },
      required: ['message'],
    },
  },
};
