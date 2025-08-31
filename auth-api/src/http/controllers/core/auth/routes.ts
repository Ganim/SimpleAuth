import { app } from '@/app';

import { authenticateWithPasswordController } from './authenticate-with-password.controller';
import { registerNewUserController } from './register-new-user.controller';

export async function authRoutes() {
  // Public Routes
  app.register(authenticateWithPasswordController);
  app.register(registerNewUserController);
}
