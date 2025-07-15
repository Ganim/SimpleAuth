import { UserAlreadyExistsError } from '@/use-cases/@errors/user-already-exists-error';
import { makeCreateProfileUseCase } from '@/use-cases/auth/factories/make-create-profile-use-case';
import { makeCreateUserUseCase } from '@/use-cases/users/factories/make-create-user-use-case';

import type { FastifyReply, FastifyRequest } from 'fastify';
import type { User } from 'generated/prisma';
import z from 'zod';

const registerUserBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = registerUserBodySchema.parse(request.body);

  let user: User;

  try {
    const createUserUseCase = makeCreateUserUseCase();
    ({ user } = await createUserUseCase.execute({ email, password }));
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send(error.message);
    }
    throw error;
  }

  try {
    const createProfileUseCase = makeCreateProfileUseCase();
    await createProfileUseCase.execute({ userId: user.id });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send(error.message);
    }
    throw error;
  }

  return reply.status(201).send({ email: user.email });
}
