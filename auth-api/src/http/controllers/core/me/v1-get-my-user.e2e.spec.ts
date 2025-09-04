import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Change My User (e2e)', () => {
  beforeAll(async () => {
    app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow a USER to GET their OWN USER data', async () => {
    const { token } = await createAndAuthenticateUser(app, 'USER');

    const response = await request(app.server)
      .get('/v1/me')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
  });
});
