import { app } from '@/app';

import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Change My Email (e2e)', () => {
  beforeAll(async () => {
    app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should allow a USER to CHANGE their OWN EMAIL', async () => {
    const { token } = await createAndAuthenticateUser(app, 'USER');
    const newEmail = 'novoemail@example.com';

    const response = await request(app.server)
      .patch('/v1/me/email')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: newEmail });

    expect(response.statusCode).toBe(200);

    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(newEmail);
  });
});
