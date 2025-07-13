import { app } from '@/app';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { authenticate } from '../auth/authenticate';
import { profile } from '../auth/profile';
import { refresh } from '../auth/refresh';

export async function authRoutes() {
  app.post('/sessions', authenticate);

  app.patch('/token/refresh', refresh);

  /* Authenticated */
  app.get('/me', { onRequest: [verifyJwt] }, profile);
}
