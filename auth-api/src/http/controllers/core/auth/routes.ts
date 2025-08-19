import { app } from '@/app';

import { authenticateWithPassword } from './authenticate-with-password';
import { refreshToken } from './refresh-token';
import { registerNewUser } from './register-new-user';

export async function authRoutes() {
  app.register(authenticateWithPassword);
  app.register(registerNewUser);
  app.register(refreshToken);
}
