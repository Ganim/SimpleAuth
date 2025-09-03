import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import { makeUniqueEmail } from '@/utils/tests/factories/core/make-unique-email';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Change User Role (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow ADMIN to CHANGE another user ROLE', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    const email = makeUniqueEmail('change-user-role');
    const anotherUser = await request(app.server)
      .post('/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email,
        password: 'Pass@123',
      });

    const userId = anotherUser.body.user?.id;

    const response = await request(app.server)
      .patch(`/v1/users/${userId}/role`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'MANAGER' });

    expect(response.statusCode).toBe(200);

    expect(response.body.user.role).toBe('MANAGER');
  });
});
