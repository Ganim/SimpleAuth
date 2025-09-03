import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import { makeUniqueEmail } from '@/utils/tests/factories/core/make-unique-email';
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

    const email = makeUniqueEmail('list-user-sessions');
    const anotherUser = await request(app.server)
      .post('/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email,
        password: 'Pass@123',
      });

    expect(anotherUser.statusCode).toEqual(201);

    const authenticateAnotherUser = await request(app.server)
      .post('/v1/auth/login/password')
      .send({
        email,
        password: 'Pass@123',
      });

    expect(authenticateAnotherUser.statusCode).toEqual(200);

    const userId = anotherUser.body.user.id;

    const response = await request(app.server)
      .get(`/v1/sessions/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.sessions).toBeInstanceOf(Array);
  });
});
