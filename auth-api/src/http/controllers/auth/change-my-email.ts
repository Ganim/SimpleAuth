import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeChangeMyEmailUseCase } from '@/use-cases/auth/factories/make-change-my-email-use-case';

import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const changeMyEmailBodySchema = z.object({
  email: z.string().email(),
});

export async function changeMyEmail(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub;
  const { email } = changeMyEmailBodySchema.parse(request.body);

  try {
    const changeMyEmailUseCase = makeChangeMyEmailUseCase();
    await changeMyEmailUseCase.execute({ userId, email });
    return reply.status(200).send({ message: 'Email updated' });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}
