import { app } from '@/app';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

let token: string;

describe('Change My Username (e2)', () => {
  beforeAll(async () => {
    await app.ready();
    const { token: userToken } = await createAndAuthenticateUser(app, 'USER');
    token = userToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should change own username', async () => {
    const response = await request(app.server)
      .patch('/me/username')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'novousername' });

    expect(response.statusCode).toBe(200);

    expect(response.body.message).toBe('Username updated');
  });
});
