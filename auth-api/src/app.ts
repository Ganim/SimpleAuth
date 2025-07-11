import fastify from 'fastify';
import z, { ZodError } from 'zod';
import { env } from './env';
import { appRoutes } from './http/routes';

export const app = fastify();

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
