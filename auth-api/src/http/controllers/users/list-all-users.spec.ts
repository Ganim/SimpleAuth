import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('List all Users (e2e)', () => {
  beforeAll(async () => {
    app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to managers/admin list all users ', async () => {
    await request(app.server).post('/users').send({
      email: 'user-1@example.com',
      password: '123456',
    });

    const { token } = await createAndAuthenticateUser(app, 'MANAGER');

    const response = await request(app.server)
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
  });
});
