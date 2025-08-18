import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeListAllUsersByRoleUseCase } from '@/use-cases/users/factories/make-list-all-users-by-role-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const listAllUsersByRoleParamsSchema = z.object({
  role: z.enum(['USER', 'MANAGER', 'ADMIN']),
});

// CONTROLLER
export async function listAllUsersByRole(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { role } = listAllUsersByRoleParamsSchema.parse(request.params);
  try {
    const listAllUsersByRoleUseCase = makeListAllUsersByRoleUseCase();
    const { users } = await listAllUsersByRoleUseCase.execute({ role });
    return reply.status(200).send({ users });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}

// ATTRIBUTES
export const listAllUsersByRoleSchema = {
  tags: ['Users'],
  summary: 'List all users by role',
  params: {
    type: 'object',
    properties: {
      role: {
        type: 'string',
        enum: ['USER', 'MANAGER', 'ADMIN'],
        description: 'User role',
      },
    },
    required: ['role'],
    additionalProperties: false,
  },
  response: {
    200: {
      description: 'List of users by role',
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
