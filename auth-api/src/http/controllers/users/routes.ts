import { app } from '@/app';
import { createUser } from './create-user';

export async function usersRoutes() {
  app.post('/users', createUser);
}
