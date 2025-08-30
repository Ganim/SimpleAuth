import { app } from '@/app';

import { authenticateWithPassword } from './authenticate-with-password';
import { registerNewUser } from './register-new-user';

export async function authRoutes() {
  app.register(authenticateWithPassword);
  app.register(registerNewUser);
}
