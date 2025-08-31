import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ForbiddenError } from '@/@errors/use-cases/forbidden-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UnauthorizedError } from '@/@errors/use-cases/unauthorized-error';
import type { FastifyInstance } from 'fastify';
import { env } from 'process';
import z, { ZodError } from 'zod';
import { UserBlockedError } from './use-cases/user-blocked-error';

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      errors: z.treeifyError(error),
    });
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    });
  }

  if (error instanceof UserBlockedError) {
    return reply.status(403).send({
      message: error.message,
      blockedUntil: error.blockedUntil,
    });
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      message: error.message,
    });
  }

  if (error instanceof ForbiddenError) {
    return reply.status(403).send({
      message: error.message,
    });
  }

  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({
      message: error.message,
    });
  }

  console.log('Internal server error:', error);

  return reply.status(500).send({
    message: 'Internal server error',
    errors: env.NODE_ENV !== 'production' ? error.message : undefined,
  });
};
