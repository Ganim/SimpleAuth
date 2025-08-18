import { makeGetMyProfileUseCase } from '@/use-cases/auth/factories/make-get-my-profile-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const getMyProfileResponseSchema = z.object({
  profile: z.object({
    id: z.string(),
    name: z.string().optional(),
    surname: z.string().optional(),
    location: z.string().optional(),
    birthday: z.string().optional(),
    bio: z.string().optional(),
    avatarUrl: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  }),
});

// CONTROLLER
export async function getMyProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getMyProfile = makeGetMyProfileUseCase();
  try {
    const { profile } = await getMyProfile.execute({
      userId: request.user.sub,
    });
    const safeProfile = {
      ...profile,
      name: profile.name ?? '',
      surname: profile.surname ?? '',
      location: profile.location ?? '',
    };
    return reply.status(200).send({ profile: safeProfile });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'Profile not found' ||
        error.message === 'User not found')
    ) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}

// ATTRIBUTES
export const getMyProfileSchema = {
  tags: ['User'],
  summary: 'Get authenticated user profile',
  response: {
    200: {
      description: 'User profile data',
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
