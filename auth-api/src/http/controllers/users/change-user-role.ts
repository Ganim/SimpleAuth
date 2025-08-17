import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeChangeUserRoleUseCase } from '@/use-cases/users/factories/make-change-user-role-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const changeUserRoleBodySchema = z.object({
  role: z.enum(['USER', 'MANAGER', 'ADMIN']),
});

export async function changeUserRole(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string };
  const { role } = changeUserRoleBodySchema.parse(request.body);

  // Apenas ADMIN pode alterar role
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
