import { app } from '@/app';
import { changeUserEmailController } from './change-user-email.controller';
import { changeUserPasswordController } from './change-user-password.controller';
import { changeUserProfileController } from './change-user-profile.controller';
import { changeUserRoleController } from './change-user-role.controller';
import { changeUserUsernameController } from './change-user-username.controller';
import { createUserController } from './create-user.controller';
import { DeleteUserByIdController } from './delete-user-by-id.controller';
import { getUserByIdController } from './get-user-by-id.controller';
import { listAllUsersByRoleController } from './list-all-users-by-role.controller';
import { listAllUsersController } from './list-all-users.controller';

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
}
