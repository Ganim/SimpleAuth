import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeChangeMyPasswordUseCase } from '@/use-cases/auth/factories/make-change-my-password-use-case';

import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const changeMyPasswordBodySchema = z.object({
  password: z.string().min(6),
});

export async function changeMyPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub;
  const { password } = changeMyPasswordBodySchema.parse(request.body);

  try {
    const changeMyPasswordUseCase = makeChangeMyPasswordUseCase();
    await changeMyPasswordUseCase.execute({ userId, password });
    return reply.status(200).send({ message: 'Password updated' });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}
