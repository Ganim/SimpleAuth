import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeChangeUsernameUseCase } from '@/use-cases/users/factories/make-change-username-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const changeUsernameBodySchema = z.object({
  username: z.string().min(3).max(30),
});
export const changeUsernameParamsSchema = z.object({
  id: z.string(),
});

// CONTROLLER
export async function changeUsername(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = changeUsernameParamsSchema.parse(request.params);
  const { username } = changeUsernameBodySchema.parse(request.body);
  try {
    const changeUsernameUseCase = makeChangeUsernameUseCase();
    await changeUsernameUseCase.execute({ id, username });
    return reply.status(200).send({ message: 'Username updated' });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    if (error instanceof Error && error.message === 'User not found') {
      return reply.status(400).send({ message: 'User not found' });
    }
    throw error;
  }
}

// ATTRIBUTES
export const changeUsernameSchema = {
  tags: ['Users'],
  summary: 'Change username',
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
      username: {
        type: 'string',
        minLength: 3,
        maxLength: 30,
        description: 'New username',
      },
    },
    required: ['username'],
    additionalProperties: false,
  },
  response: {
    200: {
      description: 'Username updated',
      type: 'object',
      properties: { message: { type: 'string' } },
      required: ['message'],
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: { message: { type: 'string' } },
      required: ['message'],
    },
  },
};
