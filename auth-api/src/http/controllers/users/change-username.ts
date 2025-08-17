import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeChangeUsernameUseCase } from '@/use-cases/users/factories/make-change-username-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const changeUsernameBodySchema = z.object({
  username: z.string().min(3).max(30),
});

export async function changeUsername(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string };
  const { username } = changeUsernameBodySchema.parse(request.body);

  try {
    const changeUsernameUseCase = makeChangeUsernameUseCase();
    await changeUsernameUseCase.execute({ id, username });
    return reply.status(200).send({ message: 'Username updated' });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}
