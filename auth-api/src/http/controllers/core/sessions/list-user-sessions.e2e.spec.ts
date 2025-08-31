import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('List All User Sessions (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow ADMIN to LIST user SESSIONS', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    const anotherUser = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'user@example.com',
        password: '123456',
      });

    expect(anotherUser.statusCode).toEqual(201);

    const authenticateAnotherUser = await request(app.server)
      .post('/auth/password')
      .send({
        email: 'user@example.com',
        password: '123456',
      });

    expect(authenticateAnotherUser.statusCode).toEqual(200);

    const userId = anotherUser.body.user.id;

    const response = await request(app.server)
      .get(`/sessions/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.sessions).toBeInstanceOf(Array);
  });
});
