import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import { uniqueEmail } from '@/utils/tests/factories/core/make-unique-email';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Change User Email (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow ADMIN to CHANGE another user EMAIL', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    const originalEmail = uniqueEmail('change_email');
    const anotherUser = await request(app.server)
      .post('/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: originalEmail,
        password: 'Pass@123',
      });

    const userId = anotherUser.body.user?.id;

    const newEmail = uniqueEmail('changed');
    const response = await request(app.server)
      .patch(`/v1/users/${userId}/email`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: newEmail });

    expect(response.statusCode).toBe(200);

    expect(response.body.user.email).toBe(newEmail);
  });
});
