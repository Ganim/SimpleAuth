import { app } from '@/app';
import { refresh } from '../auth/refresh';

import { authenticateWithPassword } from './authenticate-with-password';
import { registerUser } from './register';

export async function authRoutes() {
  app.register(authenticateWithPassword);

  app.post('/register', registerUser);
  app.patch('/token/refresh', refresh);
}
