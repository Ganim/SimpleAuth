import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import { makeUniqueEmail } from '@/utils/tests/factories/core/make-unique-email';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Get User By Email (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow ADMIN to GET another user BY EMAIL', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    const email = makeUniqueEmail('get-user-by-email');
    const anotherUser = await request(app.server)
      .post('/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email,
        password: 'Pass@123',
      });

    const createdEmail = anotherUser.body.user?.email;

    const response = await request(app.server)
      .get(`/v1/users/email/${createdEmail}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.user.email).toBe(createdEmail);
    expect(response.body.user.profile.userId).toBe(response.body.user.id);
  });
});
