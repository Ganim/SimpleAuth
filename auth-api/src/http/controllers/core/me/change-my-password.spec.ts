import { app } from '@/app';

import { createAndAuthenticateUser } from '@/utils/tests/factories/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

let token: string;

describe('Change My Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
    const { token: userToken } = await createAndAuthenticateUser(app, 'USER');
    token = userToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should change own password', async () => {
    const response = await request(app.server)
      .patch('/me/password')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: 'novasenha123' });

    expect(response.statusCode).toBe(200);

    expect(response.body.message).toBe('Password updated');
  });
});
