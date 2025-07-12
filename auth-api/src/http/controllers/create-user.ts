import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';
import { makeCreateUserUseCase } from '@/use-cases/factories/make-create-user-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const createUserBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = createUserBodySchema.parse(request.body);

  try {
    const createUserUseCase = makeCreateUserUseCase();

    await createUserUseCase.execute({ email, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send(error.message);
    }
    throw error;
  }

  return reply.status(201).send();
}
