import { app } from '@/app';
import { changeMyEmailController } from './v1-change-my-email.controller';
import { changeMyPasswordController } from './v1-change-my-password.controller';
import { changeMyProfileController } from './v1-change-my-profile.controller';
import { changeMyUsernameController } from './v1-change-my-username.controller';
import { deleteMyUserController } from './v1-delete-my-user.controller';
import { getMyUserController } from './v1-get-my-user.controller';

export async function meRoutes() {
  // Authenticated Routes
  app.register(changeMyEmailController);
  app.register(changeMyPasswordController);
  app.register(changeMyUsernameController);
  app.register(changeMyProfileController);
  app.register(getMyUserController);
  app.register(deleteMyUserController);
}
