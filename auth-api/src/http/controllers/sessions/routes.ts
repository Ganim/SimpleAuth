import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserAdmin } from '@/http/middlewares/verify-user-admin';
import { FastifyInstance } from 'fastify';
import { expireSessionController } from './expire-session';
import { listAllActiveSessionsController } from './list-all-active-sessions';
import { listMySessionsController } from './list-my-sessions';
import { listUserSessionsController } from './list-user-sessions';
import { listUserSessionsByDateController } from './list-user-sessions-by-date';

import { logoutSessionController } from './logout-session';
import { refreshSessionController } from './refresh-session';
import { revokeSessionController } from './revoke-session';

export async function sessionsRoutes(app: FastifyInstance) {
  app.post(
    '/sessions/refresh',
    { preHandler: [verifyJwt] },
    refreshSessionController,
  );
  app.get(
    '/sessions/me',
    { preHandler: [verifyJwt] },
    listMySessionsController,
  );
  app.post(
    '/sessions/logout',
    { preHandler: [verifyJwt] },
    logoutSessionController,
  );

  app.get(
    '/sessions/user/:userId',
    { preHandler: [verifyJwt, verifyUserAdmin] },
    listUserSessionsController,
  );
  app.get(
    '/sessions/active',
    { preHandler: [verifyJwt, verifyUserAdmin] },
    listAllActiveSessionsController,
  );
  app.post(
    '/sessions/revoke',
    { preHandler: [verifyJwt, verifyUserAdmin] },
    revokeSessionController,
  );
  app.post(
    '/sessions/expire',
    { preHandler: [verifyJwt, verifyUserAdmin] },
    expireSessionController,
  );
  app.get(
    '/sessions/user/:userId/by-date',
    { preHandler: [verifyJwt, verifyUserAdmin] },
    listUserSessionsByDateController,
  );
}
