import fastifyCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { env } from './@env';
import { errorHandler } from './@errors/error-handler';
import { authRoutes } from './http/controllers/core/auth/routes';
import { meRoutes } from './http/controllers/core/me/routes';
import { sessionsRoutes } from './http/controllers/core/sessions/routes';
import { usersRoutes } from './http/controllers/core/users/routes';
import { healthRoutes } from './http/controllers/health/routes';

export const app = fastify({ trustProxy: true });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Error handler
app.setErrorHandler(errorHandler);

// Rate limit
app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

// CORS - Cross-Origin Resource Sharing
app.register(cors, {
  origin: env.FRONTEND_URL,
  credentials: true,
});

// Swagger
app.register(swagger, {
  mode: 'dynamic',
  openapi: {
    info: {
      title: 'Simple Auth',
      description: 'A Simple Authentication API Boilerplate to build projects',
      version: '3.0.0',
    },
    tags: [
      { name: 'Health', description: 'Health check endpoints' },
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Me', description: 'Authenticated user endpoints' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Sessions', description: 'Session management endpoints' },
    ],
  },
});

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
app.after(() => {
  app.register(healthRoutes);
  app.register(meRoutes);
  app.register(authRoutes);
  app.register(usersRoutes);
  app.register(sessionsRoutes);
});

// Swagger UI
const swaggerTheme = new SwaggerTheme();
const theme = swaggerTheme.getBuffer(SwaggerThemeNameEnum.FLATTOP);

app.register(swaggerUI, {
  routePrefix: '/docs',
  staticCSP: true,
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
    displayRequestDuration: true,
    operationsSorter: 'method',
  },
  theme: {
    css: [{ filename: 'theme.css', content: theme }],
  },
});
