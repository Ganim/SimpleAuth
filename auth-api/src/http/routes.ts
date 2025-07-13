import { app } from '@/app';
import { authenticate } from './controllers/authenticate';
import { createUser } from './controllers/create-user';
import { profile } from './controllers/profile';
import { refresh } from './controllers/refresh';
import { verifyJwt } from './middlewares/verify-jwt';

export async function appRoutes() {
  app.post('/users', createUser);
  app.post('/sessions', authenticate);

  app.patch('/token/refresh', refresh);

  /* Authenticated */
  app.get('/me', { onRequest: [verifyJwt] }, profile);
}
