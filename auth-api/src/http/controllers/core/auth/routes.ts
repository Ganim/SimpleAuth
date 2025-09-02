import { app } from '@/app';
import { authenticateWithPasswordController } from './v1-authenticate-with-password.controller';
import { registerNewUserController } from './v1-register-new-user.controller';
import { resetPasswordByTokenController } from './v1-reset-password-by-token.controller';
import { sendPasswordResetTokenController } from './v1-send-password-reset-token.controller';

export async function authRoutes() {
  // Public Routes
  app.register(authenticateWithPasswordController);
  app.register(registerNewUserController);
  app.register(resetPasswordByTokenController);
  app.register(sendPasswordResetTokenController);
}
