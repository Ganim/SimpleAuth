import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeAuthenticateUseCase } from '@/use-cases/auth/factories/make-authenticate-use-case';

import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const authenticateUserBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

// CONTROLLER
export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = authenticateUserBodySchema.parse(request.body);
  const ip = request.ip ?? request.headers['x-forwarded-for'] ?? '';
  try {
    const authenticateUseCase = makeAuthenticateUseCase();
    const { user, sessionId } = await authenticateUseCase.execute({
      email,
      password,
      ip,
    });
    const token = await reply.jwtSign(
      { role: user.role, sessionId },
      { sign: { sub: user.id } },
    );
    const refreshToken = await reply.jwtSign(
      { role: user.role, sessionId },
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
      .send({ token, sessionId });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}

// ATTRIBUTES
export const authenticateUserSchema = {
  tags: ['Me'],
  summary: 'Authenticate user and start session',
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'User email',
      },
      password: {
        type: 'string',
        minLength: 6,
        description: 'User password',
      },
    },
    required: ['email', 'password'],
    additionalProperties: false,
  },
  response: {
    200: {
      description: 'Authentication successful',
      type: 'object',
      properties: {
        token: { type: 'string', description: 'JWT access token' },
        sessionId: { type: 'string', description: 'Session ID' },
      },
      required: ['token', 'sessionId'],
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
      required: ['message'],
    },
  },
};
