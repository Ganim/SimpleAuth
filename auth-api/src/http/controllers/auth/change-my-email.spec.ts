import { app } from '@/app';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

let token: string;

describe('E2E - /me/change/email', () => {
  beforeAll(async () => {
    await app.ready();
    const { token: userToken } = await createAndAuthenticateUser(app, 'USER');
    token = userToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('altera o email do próprio usuário', async () => {
    const response = await request(app.server)
      .patch('/me/change/email')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'novoemail@example.com' });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Email updated');
  });
});
