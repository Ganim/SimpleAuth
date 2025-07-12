import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import z, { ZodError } from 'zod';
import { env } from './env';
import { appRoutes } from './http/routes';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
});

app.register(fastifyCookie);
app.register(appRoutes);

app.setErrorHandler((error, _, reply) => {
  console.error(error);

  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', details: z.treeifyError(error) });
  }

  if (env.NODE_ENV !== 'production') {
    console.error('Error details:', error);
  }
});
