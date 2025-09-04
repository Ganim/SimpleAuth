import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('List Online Users (e2e)', () => {
  beforeAll(async () => {
    app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow USERS to LIST ONLINE users ', async () => {
    const { token } = await createAndAuthenticateUser(app, 'USER');

    await request(app.server)
      .post('/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'user-1@example.com',
        password: 'Pass@123',
      });

    const response = await request(app.server)
      .get('/v1/users/online')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
  });
});
