import { app } from '@/app';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserAdmin } from '@/http/middlewares/verify-user-admin';
import { verifyUserManager } from '@/http/middlewares/verify-user-manager';
import { changeUserEmail } from './change-user-email';
import { changeUserPassword } from './change-user-password';
import { changeUserRole } from './change-user-role';
import { changeUsername } from './change-username';
import { createUser } from './create-user';
import { deleteUser } from './delete-user';
import { getUser } from './get-user';
import { listAllUsers } from './list-all-users';
import { listAllUsersByRole } from './list-all-users-by-role';
import { updateUserProfile } from './update-user-profile';

export async function usersRoutes() {
  app.post('/users', createUser);

  app.get('/users/:id', { preHandler: [verifyJwt] }, getUser);

  app.get(
    '/users',
    { preHandler: [verifyJwt, verifyUserManager] },
    listAllUsers,
  );

  app.patch(
    '/users/:id',
    { preHandler: [verifyJwt, verifyUserManager] },
    updateUserProfile,
  );

  app.get(
    '/users/by-role/:role',
    { preHandler: [verifyJwt, verifyUserAdmin] },
    listAllUsersByRole,
  );

  app.delete(
    '/users/:id',
    { preHandler: [verifyJwt, verifyUserAdmin] },
    deleteUser,
  );

  app.patch(
    '/users/:id/email',
    { preHandler: [verifyJwt, verifyUserAdmin] },
    changeUserEmail,
  );
  app.patch(
    '/users/:id/password',
    { preHandler: [verifyJwt, verifyUserAdmin] },
    changeUserPassword,
  );
  app.patch(
    '/users/:id/role',
    { preHandler: [verifyJwt, verifyUserAdmin] },
    changeUserRole,
  );
  app.patch(
    '/users/:id/username',
    { preHandler: [verifyJwt, verifyUserAdmin] },
    changeUsername,
  );
}
