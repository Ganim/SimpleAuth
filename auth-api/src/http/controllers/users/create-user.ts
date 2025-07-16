import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeCreateProfileUseCase } from '@/use-cases/auth/factories/make-create-profile-use-case';
import { makeCreateUserUseCase } from '@/use-cases/users/factories/make-create-user-use-case';

import type { FastifyReply, FastifyRequest } from 'fastify';
import type { User } from 'generated/prisma';
import z from 'zod';

const createUserBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = createUserBodySchema.parse(request.body);

  let user: User;

  // Create user
  try {
    const createUserUseCase = makeCreateUserUseCase();
    ({ user } = await createUserUseCase.execute({ email, password }));
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }

  // Create profile
  try {
    const createProfileUseCase = makeCreateProfileUseCase();
    await createProfileUseCase.execute({ userId: user.id });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }

  return reply.status(201).send({ user });
}
