import { app } from '@/app';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserAdmin } from '@/http/middlewares/verify-user-admin';
import { verifyUserManager } from '@/http/middlewares/verify-user-manager';
import { changeUserEmail, changeUserEmailSchema } from './change-user-email';
import {
  changeUserPassword,
  changeUserPasswordSchema,
} from './change-user-password';
import { changeUserRole, changeUserRoleSchema } from './change-user-role';
import { changeUsername, changeUsernameSchema } from './change-username';
import { createUser, createUserSchema } from './create-user';
import { deleteUser, deleteUserSchema } from './delete-user';
import { getUser, getUserSchema } from './get-user';
import { listAllUsers, listAllUsersSchema } from './list-all-users';
import {
  listAllUsersByRole,
  listAllUsersByRoleSchema,
} from './list-all-users-by-role';
import {
  updateUserProfile,
  updateUserProfileSchema,
} from './update-user-profile';

export async function usersRoutes() {
  // PUBLIC ROUTES
  app.post('/users', {
    schema: createUserSchema,
    handler: createUser,
  });

  app.get('/users/:id', {
    schema: getUserSchema,
    preHandler: [verifyJwt],
    handler: getUser,
  });

  // MANAGER ROUTES
  app.get('/users', {
    schema: listAllUsersSchema,
    preHandler: [verifyJwt, verifyUserManager],
    handler: listAllUsers,
  });

  app.patch('/users/:id', {
    schema: updateUserProfileSchema,
    preHandler: [verifyJwt, verifyUserManager],
    handler: updateUserProfile,
  });

  // ADMIN ROUTES
  app.get('/users/by-role/:role', {
    schema: listAllUsersByRoleSchema,
    preHandler: [verifyJwt, verifyUserAdmin],
    handler: listAllUsersByRole,
  });

  app.delete('/users/:id', {
    schema: deleteUserSchema,
    preHandler: [verifyJwt, verifyUserAdmin],
    handler: deleteUser,
  });

  app.patch('/users/:id/email', {
    schema: changeUserEmailSchema,
    preHandler: [verifyJwt, verifyUserAdmin],
    handler: changeUserEmail,
  });
  app.patch('/users/:id/password', {
    schema: changeUserPasswordSchema,
    preHandler: [verifyJwt, verifyUserAdmin],
    handler: changeUserPassword,
  });
  app.patch('/users/:id/role', {
    schema: changeUserRoleSchema,
    preHandler: [verifyJwt, verifyUserAdmin],
    handler: changeUserRole,
  });
  app.patch('/users/:id/username', {
    schema: changeUsernameSchema,
    preHandler: [verifyJwt, verifyUserAdmin],
    handler: changeUsername,
  });
}
