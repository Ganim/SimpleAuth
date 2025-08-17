import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeCreateUserUseCase } from '@/use-cases/users/factories/make-create-user-use-case';

import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const registerUserBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  username: z.string().min(3).max(30).optional(),
  profile: z
    .object({
      name: z.string().min(1).max(50).optional(),
      surname: z.string().min(1).max(50).optional(),
    })
    .optional(),
});

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password, username, profile } = registerUserBodySchema.parse(
    request.body,
  );

  try {
    const createUserUseCase = makeCreateUserUseCase();
    const { user, profile: createdProfile } = await createUserUseCase.execute({
      email,
      password,
      username,
      profile,
    });
    return reply.status(201).send({
      email: user.email,
      profile: createdProfile,
    });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}
