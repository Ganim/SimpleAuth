import type { UserRole } from '@/@types/user-role';
import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeListAllUsersByRoleUseCase } from '@/use-cases/users/factories/make-list-all-users-by-role-use-case';

import type { FastifyReply, FastifyRequest } from 'fastify';

export async function listAllUsersByRole(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { role } = request.params as { role?: string };

  let users: Array<{
    id: string;
    username: string;
    email: string;
    role: string;
    profile?: {
      name?: string | null;
      surname?: string | null;
      birthday?: Date | null;
      location?: string | null;
      avatarUrl?: string | null;
    };
  }>;

  try {
    const listAllUsersByRoleUseCase = makeListAllUsersByRoleUseCase();
    ({ users } = await listAllUsersByRoleUseCase.execute({
      role: role as UserRole,
    }));
    return reply.status(200).send({ users });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}
