import { FastifyInstance } from 'fastify';
import { expireSessionController } from './v1-expire-session.controller';
import { listAllActiveSessionsController } from './v1-list-all-active-sessions.controller';
import { listMySessionsController } from './v1-list-my-sessions.controller';
import { listUserSessionsByDateController } from './v1-list-user-sessions-by-date.controller';
import { listUserSessionsController } from './v1-list-user-sessions.controller';
import { logoutSessionController } from './v1-logout-session.controller';
import { refreshSessionController } from './v1-refresh-session.controller';
import { revokeSessionController } from './v1-revoke-session.controller';

export async function sessionsRoutes(app: FastifyInstance) {
  // Manager Routes
  app.register(expireSessionController);
  app.register(listAllActiveSessionsController);
  app.register(listUserSessionsByDateController);
  app.register(listUserSessionsController);
  app.register(revokeSessionController);

  // Authenticated Routes
  app.register(listMySessionsController);
  app.register(logoutSessionController);
  app.register(refreshSessionController);
}
