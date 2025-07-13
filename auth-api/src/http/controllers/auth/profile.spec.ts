import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to get a profile', async () => {
    const { user } = await createAndAuthenticateUser(app);
    const { token } = await createAndAuthenticateUser(app);

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
        }),
      }),
    );
  });
});
