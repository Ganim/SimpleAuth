import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeChangeUserEmailUseCase } from '@/use-cases/users/factories/make-change-user-email-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const changeUserEmailBodySchema = z.object({
  email: z.string().email(),
});

export async function changeUserEmail(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string };
  const { email } = changeUserEmailBodySchema.parse(request.body);

  try {
    const changeUserEmailUseCase = makeChangeUserEmailUseCase();
    await changeUserEmailUseCase.execute({ id, email });
    return reply.status(200).send({ message: 'Email updated' });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}
