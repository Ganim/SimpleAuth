import { app } from '@/app';
import { changeUserEmail } from './change-user-email';
import { changeUserPassword } from './change-user-password';
import { changeUserProfile } from './change-user-profile';
import { changeUserRole } from './change-user-role';
import { changeUserUsername } from './change-user-username';
import { createUser } from './create-user';
import { DeleteUserById } from './delete-user-by-id';
import { getUserById } from './get-user-by-id';
import { listAllUsers } from './list-all-users';
import { listAllUsersByRole } from './list-all-users-by-role';

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
