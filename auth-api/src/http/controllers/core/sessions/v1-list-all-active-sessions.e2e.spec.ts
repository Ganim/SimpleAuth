import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('List All Active Sessions (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow ADMIN to LIST ALL active SESSIONS', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    const userOne = await request(app.server)
      .post('/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'user-1@example.com',
        password: 'Pass@123',
      });

    expect(userOne.statusCode).toEqual(201);

    const authenticateUserOne = await request(app.server)
      .post('/v1/auth/login/password')
      .send({
        email: 'user-1@example.com',
        password: 'Pass@123',
      });

    expect(authenticateUserOne.statusCode).toEqual(200);

    const userTwo = await request(app.server)
      .post('/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'user-2@example.com',
        password: 'Pass@123',
      });

    expect(userTwo.statusCode).toEqual(201);

    const authenticateUserTwo = await request(app.server)
      .post('/v1/auth/login/password')
      .send({
        email: 'user-2@example.com',
        password: 'Pass@123',
      });

    expect(authenticateUserTwo.statusCode).toEqual(200);

    const response = await request(app.server)
      .get(`/v1/sessions/active`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.sessions.length).toBeGreaterThanOrEqual(2);
  });
});
