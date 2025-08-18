import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeChangeUserRoleUseCase } from '@/use-cases/users/factories/make-change-user-role-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const changeUserRoleBodySchema = z.object({
  role: z.enum(['USER', 'MANAGER', 'ADMIN']),
});
export const changeUserRoleParamsSchema = z.object({
  id: z.string(),
});

// CONTROLLER
export async function changeUserRole(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = changeUserRoleParamsSchema.parse(request.params);
  const { role } = changeUserRoleBodySchema.parse(request.body);
  if (request.user.role !== 'ADMIN') {
    return reply
      .status(403)
      .send({ message: 'Only ADMIN can change user roles' });
  }
  try {
    const changeUserRoleUseCase = makeChangeUserRoleUseCase();
    await changeUserRoleUseCase.execute({ id, role });
    return reply.status(200).send({ message: 'Role updated' });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}

// ATTRIBUTES
export const changeUserRoleSchema = {
  tags: ['Users'],
  summary: 'Change user role',
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
      role: {
        type: 'string',
        enum: ['USER', 'MANAGER', 'ADMIN'],
        description: 'New role',
      },
    },
    required: ['role'],
    additionalProperties: false,
  },
  response: {
    200: {
      description: 'Role updated',
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
    403: {
      description: 'Forbidden',
      type: 'object',
      properties: { message: { type: 'string' } },
      required: ['message'],
    },
  },
};
