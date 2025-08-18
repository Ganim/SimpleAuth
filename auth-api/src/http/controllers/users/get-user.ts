import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { makeGetUserUseCase } from '../../../use-cases/users/factories/make-get-user-use-case';

// SCHEMAS
export const getUserParamsSchema = z.object({
  id: z.string(),
});

// CONTROLLER
export async function getUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = getUserParamsSchema.parse(request.params);
  try {
    const getUserUseCase = makeGetUserUseCase();
    const { user, profile } = await getUserUseCase.execute({ id });
    return reply.status(200).send({ user, profile });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}

// ATTRIBUTES
export const getUserSchema = {
  tags: ['Users'],
  summary: 'Get user by ID',
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'User ID' },
    },
    required: ['id'],
    additionalProperties: false,
  },
  response: {
    200: {
      description: 'User and profile',
      type: 'object',
      properties: {
        user: { type: 'object' },
        profile: { type: 'object' },
      },
      required: ['user', 'profile'],
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: { message: { type: 'string' } },
      required: ['message'],
    },
  },
};
