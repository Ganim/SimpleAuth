import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeListAllUsersUseCase } from '@/use-cases/users/factories/make-list-all-users-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';

// CONTROLLER
export async function listAllUsers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const listAllUsersUseCase = makeListAllUsersUseCase();
    const { users } = await listAllUsersUseCase.execute();
    return reply.status(200).send({ users });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}

// ATTRIBUTES
export const listAllUsersSchema = {
  tags: ['Users'],
  summary: 'List all users',
  response: {
    200: {
      description: 'List of users',
      type: 'object',
      properties: {
        users: { type: 'array', items: { type: 'object' } },
      },
      required: ['users'],
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: { message: { type: 'string' } },
      required: ['message'],
    },
  },
};
