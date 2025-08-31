import { app } from '@/app';
import { changeMyEmailController } from './change-my-email.controller';
import { changeMyPasswordController } from './change-my-password.controller';
import { changeMyProfileController } from './change-my-profile.controller';
import { changeMyUsernameController } from './change-my-username.controller';
import { deleteMyUserController } from './delete-my-user.controller';
import { getMyUserController } from './get-my-user.controller';

export async function meRoutes() {
  // Authenticated Routes
  app.register(changeMyEmailController);
  app.register(changeMyPasswordController);
  app.register(changeMyUsernameController);
  app.register(changeMyProfileController);
  app.register(getMyUserController);
  app.register(deleteMyUserController);
}
