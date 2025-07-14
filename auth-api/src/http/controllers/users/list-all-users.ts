import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found-error';
import { makeListAllUsersUseCase } from '@/use-cases/users/factories/list-all-users-use-case';

import type { FastifyReply, FastifyRequest } from 'fastify';
import type { User } from 'generated/prisma';

export async function listAllUsers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  let users: User[];

  try {
    const listAllUsersUseCase = makeListAllUsersUseCase();

    ({ users } = await listAllUsersUseCase.execute());
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send(error.message);
    }
    throw error;
  }

  return reply.status(201).send({ users });
}
