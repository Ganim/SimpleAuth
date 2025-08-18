import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import { env } from './env';
import { authRoutes } from './http/controllers/auth/routes';
import { sessionsRoutes } from './http/controllers/sessions/routes';
import { usersRoutes } from './http/controllers/users/routes';
import { errorHandler } from './http/error-handler';

export const app = fastify();

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
app.register(authRoutes);
app.register(usersRoutes);
app.register(sessionsRoutes);
