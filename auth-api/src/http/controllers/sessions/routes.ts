import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserAdmin } from '@/http/middlewares/verify-user-admin';
import { FastifyInstance } from 'fastify';
import { expireSessionController, expireSessionSchema } from './expire-session';
import {
  listAllActiveSessionsController,
  listAllActiveSessionsSchema,
} from './list-all-active-sessions';
import {
  listMySessionsController,
  listMySessionsSchema,
} from './list-my-sessions';
import {
  listUserSessionsController,
  listUserSessionsSchema,
} from './list-user-sessions';
import {
  listUserSessionsByDateController,
  listUserSessionsByDateSchema,
} from './list-user-sessions-by-date';
import { logoutSessionController, logoutSessionSchema } from './logout-session';
import {
  refreshSessionController,
  refreshSessionSchema,
} from './refresh-session';
import { revokeSessionController, revokeSessionSchema } from './revoke-session';

export async function sessionsRoutes(app: FastifyInstance) {
  // AUTHENTICATED ROUTES
  app.post('/sessions/refresh', {
    schema: refreshSessionSchema,
    preHandler: [verifyJwt],
    handler: refreshSessionController,
  });
  app.get('/sessions/me', {
    schema: listMySessionsSchema,
    preHandler: [verifyJwt],
    handler: listMySessionsController,
  });
  app.post('/sessions/logout', {
    schema: logoutSessionSchema,
    preHandler: [verifyJwt],
    handler: logoutSessionController,
  });

  // ADMIN ROUTES
  app.get('/sessions/user/:userId', {
    schema: listUserSessionsSchema,
    preHandler: [verifyJwt, verifyUserAdmin],
    handler: listUserSessionsController,
  });
  app.get('/sessions/active', {
    schema: listAllActiveSessionsSchema,
    preHandler: [verifyJwt, verifyUserAdmin],
    handler: listAllActiveSessionsController,
  });
  app.post('/sessions/revoke', {
    schema: revokeSessionSchema,
    preHandler: [verifyJwt, verifyUserAdmin],
    handler: revokeSessionController,
  });
  app.post('/sessions/expire', {
    schema: expireSessionSchema,
    preHandler: [verifyJwt, verifyUserAdmin],
    handler: expireSessionController,
  });
  app.get('/sessions/user/:userId/by-date', {
    schema: listUserSessionsByDateSchema,
    preHandler: [verifyJwt, verifyUserAdmin],
    handler: listUserSessionsByDateController,
  });
}
