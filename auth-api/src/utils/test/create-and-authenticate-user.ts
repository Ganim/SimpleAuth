import { app } from '@/app';
import request from 'supertest';

export async function createAndAuthenticateUser() {
  const userResponse = await request(app.server).post('/users').send({
    email: 'johndoe@example.com',
    password: '123456',
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  });

  const { token } = authResponse.body;

  return {
    user: userResponse.body.user,
    token,
  };
}
