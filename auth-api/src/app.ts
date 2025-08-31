import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { env } from './@env';
import { errorHandler } from './@errors/error-handler';
import { authRoutes } from './http/controllers/core/auth/routes';
import { meRoutes } from './http/controllers/core/me/routes';
import { sessionsRoutes } from './http/controllers/core/sessions/routes';
import { usersRoutes } from './http/controllers/core/users/routes';

export const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Error handler
app.setErrorHandler(errorHandler);

// Authentication
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    algorithm: 'HS256',
    expiresIn: '10m',
  },
  verify: {
    algorithms: ['HS256'],
  },
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
});

app.register(fastifyCookie);

// Routes
app.register(meRoutes);
app.register(authRoutes);
app.register(usersRoutes);
app.register(sessionsRoutes);
