import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Delete User By Id (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow ADMIN to DELETE another user BY ID', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    const anotherUser = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'user@example.com',
        password: '123456',
      });

    const userId = anotherUser.body.user?.id;

    const response = await request(app.server)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'ADMIN' });

    expect(response.statusCode).toBe(200);

    const userResponse = await request(app.server)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(userId).toBeDefined();

    expect(userResponse.statusCode).toBe(404);
  });
});
