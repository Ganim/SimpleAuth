import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { CreteUserUseCase } from '@/use-cases/create-user';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const createUserBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = createUserBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const createUserUseCase = new CreteUserUseCase(usersRepository);

    await createUserUseCase.execute({ email, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send(error.message);
    }
    throw error;
  }

  return reply.status(201).send();
}
