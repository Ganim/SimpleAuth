import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Change User Password (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow ADMIN to CHANGE another user PASSWORD', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    const anotherUser = await request(app.server)
      .post('/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'user@example.com',
        password: 'Pass@123',
      });

    const userId = anotherUser.body.user?.id;

    const response = await request(app.server)
      .patch(`/v1/users/${userId}/password`)
      .set('Authorization', `Bearer ${token}`)
      .send({ password: 'newpass123' });

    expect(response.statusCode).toBe(200);
  });
});
