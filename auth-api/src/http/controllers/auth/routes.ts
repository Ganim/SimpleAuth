import { app } from '@/app';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { authenticateUser, authenticateUserSchema } from './authenticate-user';
import { changeMyEmail, changeMyEmailSchema } from './change-my-email';
import { changeMyPassword, changeMyPasswordSchema } from './change-my-password';
import { changeMyUsername, changeMyUsernameSchema } from './change-my-username';
import { getMyProfile, getMyProfileSchema } from './get-my-profile';
import { refreshAuthToken, refreshAuthTokenSchema } from './refresh-auth-token';
import { registerNewUser, registerNewUserSchema } from './register-new-user';
import { updateMyProfile, updateMyProfileSchema } from './update-my-profile';

export async function authRoutes() {
  // PUBLIC ROUTES
  app.post('/register', {
    schema: registerNewUserSchema,
    handler: registerNewUser,
  });

  app.post('/sessions', {
    schema: authenticateUserSchema,
    handler: authenticateUser,
  });

  app.patch('/token/refresh', {
    schema: refreshAuthTokenSchema,
    handler: refreshAuthToken,
  });

  // AUTHENTICATED ROUTES

  app.get('/me', {
    schema: getMyProfileSchema,
    preHandler: [verifyJwt],
    handler: getMyProfile,
  });

  app.patch('/me/profile', {
    schema: updateMyProfileSchema,
    preHandler: [verifyJwt],
    handler: updateMyProfile,
  });

  app.patch('/me/email', {
    schema: changeMyEmailSchema,
    preHandler: [verifyJwt],
    handler: changeMyEmail,
  });

  app.patch('/me/password', {
    schema: changeMyPasswordSchema,
    preHandler: [verifyJwt],
    handler: changeMyPassword,
  });

  app.patch('/me/username', {
    schema: changeMyUsernameSchema,
    preHandler: [verifyJwt],
    handler: changeMyUsername,
  });
}
