import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeChangeUserPasswordUseCase } from '@/use-cases/users/factories/make-change-user-password-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const changeUserPasswordBodySchema = z.object({
  password: z.string().min(6),
});
export const changeUserPasswordParamsSchema = z.object({
  id: z.string(),
});

// CONTROLLER
export async function changeUserPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = changeUserPasswordParamsSchema.parse(request.params);
  const { password } = changeUserPasswordBodySchema.parse(request.body);
  try {
    const changeUserPasswordUseCase = makeChangeUserPasswordUseCase();
    await changeUserPasswordUseCase.execute({ id, password });
    return reply.status(200).send({ message: 'Password updated' });
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
export const changeUserPasswordSchema = {
  tags: ['Users'],
  summary: 'Change user password',
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
      password: { type: 'string', minLength: 6, description: 'New password' },
    },
    required: ['password'],
    additionalProperties: false,
  },
  response: {
    200: {
      description: 'Password updated',
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
