import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Get User By Username (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow ADMIN to GET another user BY USERNAME', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    const anotherUser = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'user3@example.com',
        password: 'Pass@123',
      });

    const username = anotherUser.body.user?.username;

    const response = await request(app.server)
      .get(`/users/username/${username}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.user.username).toBe(username);
    expect(response.body.user.profile.userId).toBe(response.body.user.id);
  });
});
