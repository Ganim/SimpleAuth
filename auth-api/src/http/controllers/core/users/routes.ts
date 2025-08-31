import { app } from '@/app';
import { changeUserEmail } from './change-user-email.controller';
import { changeUserPassword } from './change-user-password.controller';
import { changeUserProfile } from './change-user-profile.controller';
import { changeUserRole } from './change-user-role.controller';
import { changeUserUsername } from './change-user-username.controller';
import { createUser } from './create-user.controller';
import { DeleteUserById } from './delete-user-by-id.controller';
import { getUserById } from './get-user-by-id.controller';
import { listAllUsersByRole } from './list-all-users-by-role.controller';
import { listAllUsers } from './list-all-users.controller';

export async function usersRoutes() {
  // Admin routes
  app.register(changeUserEmail);
  app.register(changeUserPassword);
  app.register(changeUserRole);
  app.register(changeUserUsername);
  app.register(changeUserProfile);
  app.register(DeleteUserById);
  app.register(listAllUsersByRole);

  // Manager routes
  app.register(createUser);
  app.register(listAllUsers);

  // Authenticated routes
  app.register(getUserById);
}
