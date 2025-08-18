import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeChangeMyEmailUseCase } from '@/use-cases/auth/factories/make-change-my-email-use-case';

import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const changeMyEmailBodySchema = z.object({
  email: z.email(),
});

// CONTROLLER
export async function changeMyEmail(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub;
  const { email } = changeMyEmailBodySchema.parse(request.body);
  try {
    const changeMyEmailUseCase = makeChangeMyEmailUseCase();
    await changeMyEmailUseCase.execute({ userId, email });
    return reply.status(200).send({ message: 'Email updated' });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}

// ATTRIBUTES
export const changeMyEmailSchema = {
  tags: ['User'],
  summary: 'Change user email',
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'New email for the user',
      },
    },
    required: ['email'],
    additionalProperties: false,
  },
  response: {
    200: {
      description: 'Email updated',
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
