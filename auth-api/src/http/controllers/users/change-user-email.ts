import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeChangeUserEmailUseCase } from '@/use-cases/users/factories/make-change-user-email-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const changeUserEmailBodySchema = z.object({
  email: z.email(),
});
export const changeUserEmailParamsSchema = z.object({
  id: z.string(),
});

// CONTROLLER
export async function changeUserEmail(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = changeUserEmailParamsSchema.parse(request.params);
  const { email } = changeUserEmailBodySchema.parse(request.body);
  try {
    const changeUserEmailUseCase = makeChangeUserEmailUseCase();
    await changeUserEmailUseCase.execute({ id, email });
    return reply.status(200).send({ message: 'Email updated' });
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
export const changeUserEmailSchema = {
  tags: ['Users'],
  summary: 'Change user email',
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
      email: { type: 'string', format: 'email', description: 'New email' },
    },
    required: ['email'],
    additionalProperties: false,
  },
  response: {
    200: {
      description: 'Email updated',
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
