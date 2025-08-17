import { app } from '@/app';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserManager } from '@/http/middlewares/verify-user-manager';
import { createUserAndProfile } from './create-user-and-profile';
import { deleteUser } from './delete-user';
import { editUser } from './edit-user';
import { getUser } from './get-user';
import { listAllUsers } from './list-all-users';

export async function usersRoutes() {
  app.post('/users', createUserAndProfile);

  app.get(
    '/users',
    { preHandler: [verifyJwt, verifyUserManager] },
    listAllUsers,
  );

  app.get(
    '/users/:id',
    { preHandler: [verifyJwt, verifyUserManager] },
    getUser,
  );

  app.patch(
    '/users/:id',
    { preHandler: [verifyJwt, verifyUserManager] },
    editUser,
  );

  app.delete(
    '/users/:id',
    { preHandler: [verifyJwt, verifyUserManager] },
    deleteUser,
  );
}
