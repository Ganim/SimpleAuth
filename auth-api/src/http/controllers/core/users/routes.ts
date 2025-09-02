import { app } from '@/app';
import { changeUserEmailController } from './v1-change-user-email.controller';
import { changeUserPasswordController } from './v1-change-user-password.controller';
import { changeUserProfileController } from './v1-change-user-profile.controller';
import { changeUserRoleController } from './v1-change-user-role.controller';
import { changeUserUsernameController } from './v1-change-user-username.controller';
import { createUserController } from './v1-create-user.controller';
import { DeleteUserByIdController } from './v1-delete-user-by-id.controller';
import { getUserByEmailController } from './v1-get-user-by-email.controller';
import { getUserByIdController } from './v1-get-user-by-id.controller';
import { getUserByUsernameController } from './v1-get-user-by-username.controller';
import { listAllUsersByRoleController } from './v1-list-all-users-by-role.controller';
import { listAllUsersController } from './v1-list-all-users.controller';

export async function usersRoutes() {
  // Admin routes
  app.register(changeUserEmailController);
  app.register(changeUserPasswordController);
  app.register(changeUserRoleController);
  app.register(changeUserUsernameController);
  app.register(changeUserProfileController);
  app.register(DeleteUserByIdController);
  app.register(listAllUsersByRoleController);

  // Manager routes
  app.register(createUserController);
  app.register(listAllUsersController);

  // Authenticated routes
  app.register(getUserByIdController);
  app.register(getUserByEmailController);
  app.register(getUserByUsernameController);
}
