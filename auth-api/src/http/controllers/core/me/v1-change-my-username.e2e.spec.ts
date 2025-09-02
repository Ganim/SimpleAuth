import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Change My Username (e2e)', () => {
  beforeAll(async () => {
    app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should allow a USER to CHANGE their OWN USERNAME', async () => {
    const { token } = await createAndAuthenticateUser(app, 'USER');

    const response = await request(app.server)
      .patch('/v1/me/username')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'novousername' });

    expect(response.statusCode).toBe(200);

    expect(response.body.user.username).toBe('novousername');
  });
});
