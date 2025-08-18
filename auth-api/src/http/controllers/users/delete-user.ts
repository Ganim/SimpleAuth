import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeDeleteUserUseCase } from '@/use-cases/users/factories/make-delete-user-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const deleteUserParamsSchema = z.object({
  id: z.string(),
});

// CONTROLLER
export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = deleteUserParamsSchema.parse(request.params);
  try {
    const deleteUserUseCase = makeDeleteUserUseCase();
    await deleteUserUseCase.execute({ id });
    return reply.status(200).send({ message: 'User deleted' });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}

// ATTRIBUTES
export const deleteUserSchema = {
  tags: ['User'],
  summary: 'Delete a user',
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
      description: 'User deleted',
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
