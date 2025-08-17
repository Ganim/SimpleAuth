import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeChangeUserPasswordUseCase } from '@/use-cases/users/factories/make-change-user-password-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const changeUserPasswordBodySchema = z.object({
  password: z.string().min(6),
});

export async function changeUserPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string };
  const { password } = changeUserPasswordBodySchema.parse(request.body);

  try {
    const changeUserPasswordUseCase = makeChangeUserPasswordUseCase();
    await changeUserPasswordUseCase.execute({ id, password });
    return reply.status(200).send({ message: 'Password updated' });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}
