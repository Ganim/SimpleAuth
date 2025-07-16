import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
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
    if (error instanceof BadRequestError) {
      return reply.status(400).send(error.message);
    }
    throw error;
  }

  return reply.status(200).send({ users });
}
