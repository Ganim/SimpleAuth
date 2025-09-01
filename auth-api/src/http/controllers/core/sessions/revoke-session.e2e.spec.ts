import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Revoke Session (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow ADMIN to REVOKE an user SESSION', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    const anotherUser = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'user@example.com',
        password: 'Pass@123',
      });

    expect(anotherUser.statusCode).toEqual(201);

    const authenticateAnotherUser = await request(app.server)
      .post('/auth/password')
      .send({
        email: 'user@example.com',
        password: 'Pass@123',
      });

    expect(authenticateAnotherUser.statusCode).toEqual(200);

    const sessionId = authenticateAnotherUser.body.sessionId;

    const response = await request(app.server)
      .patch(`/sessions/${sessionId}/revoke`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});
