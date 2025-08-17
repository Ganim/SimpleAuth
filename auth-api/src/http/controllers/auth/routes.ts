import { app } from '@/app';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { authenticate } from '../auth/authenticate';
import { profile } from '../auth/profile';
import { refresh } from '../auth/refresh';
import { changeMyEmail } from './change-my-email';
import { changeMyPassword } from './change-my-password';
import { changeMyUsername } from './change-my-username';
import { editMe } from './edit-me';
import { registerUser } from './register';
import { updateMyProfile } from './update-my-profile';

export async function authRoutes() {
  // Rotas públicas
  app.post('/register', registerUser);
  app.post('/sessions', authenticate);
  app.patch('/token/refresh', refresh);

  // Rotas autenticadas
  app.get('/me', { preHandler: [verifyJwt] }, profile);
  app.patch('/me', { preHandler: [verifyJwt] }, editMe);

  // Rotas de alteração do próprio usuário
  app.patch('/me/update/profile', { preHandler: [verifyJwt] }, updateMyProfile);
  app.patch('/me/change/email', { preHandler: [verifyJwt] }, changeMyEmail);
  app.patch(
    '/me/change/password',
    { preHandler: [verifyJwt] },
    changeMyPassword,
  );
  app.patch(
    '/me/change/username',
    { preHandler: [verifyJwt] },
    changeMyUsername,
  );
}
