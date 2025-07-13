import { app } from '@/app';
import { authenticate } from './controllers/users/authenticate';
import { createUser } from './controllers/users/create-user';
import { profile } from './controllers/users/profile';
import { refresh } from './controllers/users/refresh';
import { verifyJwt } from './middlewares/verify-jwt';

export async function appRoutes() {
  app.post('/users', createUser);
  app.post('/sessions', authenticate);

  app.patch('/token/refresh', refresh);

  /* Authenticated */
  app.get('/me', { onRequest: [verifyJwt] }, profile);
}
