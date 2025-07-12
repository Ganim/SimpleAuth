import { app } from '@/app';
import { authenticate } from './controllers/authenticate';
import { createUser } from './controllers/create-user';
import { refresh } from './controllers/refresh';

export async function appRoutes() {
  app.post('/users', createUser);
  app.post('/sessions', authenticate);

  app.patch('/token/refresh', refresh);
}
