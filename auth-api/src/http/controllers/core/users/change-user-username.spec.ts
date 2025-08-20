import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Change Username (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow ADMIN to change username of another user', async () => {
    const createResponse = await request(app.server).post('/users').send({
      email: 'user@example.com',
      password: '123456',
    });
    const userId = createResponse.body.user.id;
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');
    const response = await request(app.server)
      .patch(`/users/${userId}/username`)
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'newusername' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ message: 'Username updated' }),
    );
  });

  it('should return 400 if user does not exist (ADMIN)', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const response = await request(app.server)
      .patch(`/users/${fakeId}/username`)
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'fail' });
    expect(response.statusCode).toBe(404);
  });

  it('should return 403 if USER tries to change username of another user', async () => {
    const createResponse = await request(app.server).post('/users').send({
      email: 'user2@example.com',
      password: '123456',
    });
    expect(createResponse.body.user).toBeDefined();
    const userId = createResponse.body.user.id;
    const { token } = await createAndAuthenticateUser(app, 'USER');
    const response = await request(app.server)
      .patch(`/users/${userId}/username`)
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'newusername' });
    expect(response.statusCode).toBe(403);
  });
});
