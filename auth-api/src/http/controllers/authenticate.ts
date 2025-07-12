import { InvalidCredentialsError } from '@/use-cases/errors/invalide-credentials-error';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({ email, password });

    const token = await reply.jwtSign({}, { sign: { sub: user.id } });

    const refreshToken = await reply.jwtSign(
      {},
      { sign: { sub: user.id, expiresIn: '7d' } },
    );
    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send(error.message);
    }
    throw error;
  }
}
