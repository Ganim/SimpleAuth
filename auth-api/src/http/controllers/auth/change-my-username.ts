import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeChangeMyUsernameUseCase } from '@/use-cases/auth/factories/make-change-my-username-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const changeMyUsernameBodySchema = z.object({
  username: z.string().min(3).max(30),
});

// CONTROLLER
export async function changeMyUsername(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub;
  const { username } = changeMyUsernameBodySchema.parse(request.body);
  try {
    const changeMyUsernameUseCase = makeChangeMyUsernameUseCase();
    await changeMyUsernameUseCase.execute({ userId, username });
    return reply.status(200).send({ message: 'Username updated' });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}

// ATTRIBUTES
export const changeMyUsernameSchema = {
  tags: ['User'],
  summary: 'Change user username',
  body: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        minLength: 3,
        maxLength: 30,
        description: 'New username for the user',
      },
    },
    required: ['username'],
    additionalProperties: false,
  },
  response: {
    200: {
      description: 'Username updated',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
      required: ['message'],
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
