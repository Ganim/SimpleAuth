import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import fastify from 'fastify';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
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

// Cookies
app.register(fastifyCookie);

// Swagger
app.register(swagger, {
  mode: 'dynamic',
  openapi: {
    info: {
      title: 'Simple Auth API',
      description: 'A Simple Authentication API Boilerplate',
      version: '2.5.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Health', description: 'Health check endpoints' },
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Me', description: 'Authenticated User endpoints' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Sessions', description: 'Session management endpoints' },
    ],
  },
});

// Routes
app.after(() => {
  app.register(authRoutes);
  app.register(usersRoutes);
  app.register(sessionsRoutes);
});

// Swagger UI
const theme = new SwaggerTheme();
const content = theme.getBuffer(SwaggerThemeNameEnum.FLATTOP);

app.register(swaggerUI, {
  routePrefix: '/docs',
  staticCSP: true,
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
    tagsSorter: 'method',
    operationsSorter: 'method',
  },
  theme: {
    css: [{ filename: 'theme.css', content: content }],
  },
});
