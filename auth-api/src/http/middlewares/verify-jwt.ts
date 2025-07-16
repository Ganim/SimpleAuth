import { UnauthorizedError } from '@/use-cases/@errors/unauthorized-error';
import type { FastifyRequest } from 'fastify';

export async function verifyJwt(request: FastifyRequest) {
  try {
    await request.jwtVerify();
  } catch {
    throw new UnauthorizedError('User not authorized');
  }
}
