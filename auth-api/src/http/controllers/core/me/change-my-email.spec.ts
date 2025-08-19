import { app } from '@/app';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

let token: string;

describe('Change My Email (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
    const { token: userToken } = await createAndAuthenticateUser(app, 'USER');
    token = userToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should change own email', async () => {
    const response = await request(app.server)
      .patch('/me/email')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'novoemail@example.com' });

    expect(response.statusCode).toBe(200);

    expect(response.body.message).toBe('Email updated');
  });
});
