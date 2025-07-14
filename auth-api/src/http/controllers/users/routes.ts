import { app } from '@/app';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserManager } from '@/http/middlewares/verify-user-manager';
import { createUser } from './create-user';
import { listAllUsers } from './list-all-users';

export async function usersRoutes() {
  app.post('/users', createUser);
  app.get(
    '/users',
    { onRequest: [verifyJwt, verifyUserManager] },
    listAllUsers,
  );
}
