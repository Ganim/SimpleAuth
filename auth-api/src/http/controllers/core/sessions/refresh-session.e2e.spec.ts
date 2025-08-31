import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Refresh Session (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow USER to REFRESH his SESSION', async () => {
    const { refreshToken } = await createAndAuthenticateUser(app, 'USER');

    const res = await request(app.server)
      .patch('/sessions/refresh')
      .set('Authorization', `Bearer ${refreshToken}`);
    expect(res.status).toBe(204);
  });
});
