import { app } from '@/app';
import { changeMyEmail } from './change-my-email';
import { changeMyPassword } from './change-my-password';
import { changeMyProfile } from './change-my-profile';
import { changeMyUsername } from './change-my-username';
import { getMyProfile } from './get-my-profile';

export async function meRoutes() {
  app.register(changeMyEmail);
  app.register(changeMyPassword);
  app.register(changeMyUsername);
  app.register(changeMyProfile);
  app.register(getMyProfile);
}
