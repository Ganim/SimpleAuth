import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeCreateUserUseCase } from '@/use-cases/users/factories/make-create-user-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const createUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  profile: z
    .object({
      name: z.string().min(1).max(32).optional(),
      surname: z.string().min(1).max(32).optional(),
      birthday: z.coerce.date().optional(),
      location: z.string().max(128).optional(),
      avatarUrl: z.string().max(256).optional(),
    })
    .optional(),
});

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const { email, password, profile } = createUserBodySchema.parse(request.body);

  try {
    const createUserUseCase = makeCreateUserUseCase();
    const { user, profile: createdProfile } = await createUserUseCase.execute({
      email,
      password,
      profile,
    });
    return reply
      .status(201)
      .send({ user, email: user.email, profile: createdProfile });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}
