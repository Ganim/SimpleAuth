import { app } from '@/app';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { authenticate } from '../auth/authenticate';
import { profile } from '../auth/profile';
import { refresh } from '../auth/refresh';
import { editMe } from './edit-me';
import { registerUser } from './register';

export async function authRoutes() {
  // Rotas públicas
  app.post('/register', registerUser);
  app.post('/sessions', authenticate);
  app.patch('/token/refresh', refresh);

  // Rotas autenticadas
  app.get('/me', { preHandler: [verifyJwt] }, profile);
  app.patch('/me', { preHandler: [verifyJwt] }, editMe);
}
