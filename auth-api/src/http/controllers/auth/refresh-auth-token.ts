import { PrismaSessionsRepository } from '@/repositories/prisma/prisma-sessions-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
// Refresh Auth Token Schema
const refreshAuthTokenBodySchema = z.object({
  sessionId: z.string().optional(),
});

// Esquema para o payload do JWT
const jwtPayloadSchema = z.object({
  sub: z.string(),
  role: z.string(),
  sessionId: z.string().optional(),
});

// CONTROLLER
// Refresh Auth Token Controller

export async function refreshAuthToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const refreshAuthTokenBody = refreshAuthTokenBodySchema.parse(request.body);
  const jwtPayload = jwtPayloadSchema.parse(request.user);

  await request.jwtVerify({ onlyCookie: true });

  const sessionId =
    request.cookies.sessionId ||
    refreshAuthTokenBody?.sessionId ||
    jwtPayload?.sessionId;
  const ip = request.ip ?? request.headers['x-forwarded-for'] ?? '';
  if (sessionId) {
    const sessionsRepository = new PrismaSessionsRepository();
    await sessionsRepository.updateSessionInfo(sessionId, ip);
  }

  const token = await reply.jwtSign(
    { role: request.user.role, sessionId },
    { sign: { sub: request.user.sub } },
  );

  const refreshToken = await reply.jwtSign(
    { role: request.user.role, sessionId },
    { sign: { sub: request.user.sub, expiresIn: '7d' } },
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
}

// ATTRIBUTES
// Swagger documentation for the refreshAuthToken route

export const refreshAuthTokenSchema = {
  tags: ['Me'],
  summary: 'Refresh user session authentication token.',
  description:
    'Receives an optional sessionId and returns a new JWT access token. Also updates session information (IP). The returned token follows the JWT standard and is sent in the response body. The refreshToken is sent via cookie.',
  body: {
    type: 'object',
    properties: {
      sessionId: {
        type: 'string',
        description: 'User session ID (optional)',
      },
    },
    required: [],
    additionalProperties: false,
  },
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: 'JWT access token renewed and refreshToken sent via cookie.',
      type: 'object',
      properties: {
        token: {
          type: 'string',
          description: 'New JWT access token. Format: Bearer <JWT>.',
        },
      },
      required: ['token'],
      additionalProperties: false,
    },
    401: {
      description: 'Unauthorized',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
      additionalProperties: false,
    },
    403: {
      description: 'Forbidden',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
      additionalProperties: false,
    },
  },
};
