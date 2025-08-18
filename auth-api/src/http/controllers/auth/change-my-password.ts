import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeChangeMyPasswordUseCase } from '@/use-cases/auth/factories/make-change-my-password-use-case';

import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const changeMyPasswordBodySchema = z.object({
  password: z.string().min(6),
});

// CONTROLLER
export async function changeMyPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub;
  const { password } = changeMyPasswordBodySchema.parse(request.body);
  try {
    const changeMyPasswordUseCase = makeChangeMyPasswordUseCase();
    await changeMyPasswordUseCase.execute({ userId, password });
    return reply.status(200).send({ message: 'Password updated' });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}

// ATTRIBUTES
export const changeMyPasswordSchema = {
  tags: ['User'],
  summary: 'Change user password',
  body: {
    type: 'object',
    properties: {
      password: {
        type: 'string',
        minLength: 6,
        description: 'New password for the user',
      },
    },
    required: ['password'],
    additionalProperties: false,
  },
  response: {
    200: {
      description: 'Password updated',
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
