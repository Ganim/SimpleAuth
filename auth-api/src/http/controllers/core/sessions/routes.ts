import { FastifyInstance } from 'fastify';
import { expireSessionController } from './expire-session.controller';
import { listAllActiveSessionsController } from './list-all-active-sessions.controller';
import { listMySessionsController } from './list-my-sessions.controller';
import { listUserSessionsByDateController } from './list-user-sessions-by-date.controller';
import { listUserSessionsController } from './list-user-sessions.controller';
import { logoutSessionController } from './logout-session.controller';
import { refreshSessionController } from './refresh-session.controller';
import { revokeSessionController } from './revoke-session.controller';

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
