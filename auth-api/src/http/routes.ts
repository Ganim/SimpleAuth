import { app } from '@/app';
import { createUser } from './controllers/create-user';

export async function appRoutes() {
  app.post('/users', createUser);
}
