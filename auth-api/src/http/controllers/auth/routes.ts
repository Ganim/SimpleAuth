import { app } from '@/app';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { authenticate } from '../auth/authenticate';
import { refresh } from '../auth/refresh';
import { changeMyEmail } from './change-my-email';
import { changeMyPassword } from './change-my-password';
import { changeMyUsername } from './change-my-username';
import { getMyProfile } from './get-my-profile';
import { registerUser } from './register';
import { updateMyProfile } from './update-my-profile';

export async function authRoutes() {
  app.post('/register', registerUser);
  app.post('/sessions', authenticate);
  app.patch('/token/refresh', refresh);

  app.get('/me', { preHandler: [verifyJwt] }, getMyProfile);

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
