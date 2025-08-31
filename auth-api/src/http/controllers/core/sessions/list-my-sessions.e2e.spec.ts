import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('List My Sessions (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow USER to LIST ALL his SESSIONS', async () => {
    const { token } = await createAndAuthenticateUser(app, 'USER');

    const response = await request(app.server)
      .get(`/sessions/me`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
