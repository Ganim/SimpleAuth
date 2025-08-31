import { app } from '@/app';

import { authenticateWithPassword } from './authenticate-with-password.controller';
import { registerNewUser } from './register-new-user.controller';

export async function authRoutes() {
  // Public Routes
  app.register(authenticateWithPassword);
  app.register(registerNewUser);
}
