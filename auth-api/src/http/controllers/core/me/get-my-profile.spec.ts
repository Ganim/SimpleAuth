import { app } from '@/app';
import { createAndAuthenticateUser } from '@/tests/factories/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Change My Profile (e2e)', () => {
  beforeAll(async () => {
    app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to get a profile', async () => {
    const { user, token } = await createAndAuthenticateUser(app, 'USER');

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        profile: expect.objectContaining({
          id: expect.any(String),
          userId: user.id,
          name: expect.any(String),
          surname: expect.any(String),
          location: expect.any(String),
          email: user.email,
          username: user.username,
        }),
      }),
    );
  });
});
