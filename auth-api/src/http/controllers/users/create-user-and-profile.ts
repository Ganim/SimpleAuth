import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeCreateUserAndProfileUseCase } from '@/use-cases/users/factories/make-create-user-and-profile-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const createUserAndProfileBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  profile: z
    .object({
      name: z.string().min(1).max(32).optional(),
      surname: z.string().min(1).max(32).optional(),
      birthday: z.coerce.date().optional(),
      location: z.string().max(128).optional(),
    })
    .optional(),
});

export async function createUserAndProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password, profile } = createUserAndProfileBodySchema.parse(
    request.body,
  );

  try {
    const createUserAndProfileUseCase = makeCreateUserAndProfileUseCase();
    makeCreateUserAndProfileUseCase();
    const { user, profile: createdProfile } =
      await createUserAndProfileUseCase.execute({
        email,
        password,
        profile,
      });
    return reply.status(201).send({ user, profile: createdProfile });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}
