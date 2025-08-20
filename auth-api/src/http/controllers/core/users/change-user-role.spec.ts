import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Change User Role (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow ADMIN to change user role', async () => {
    const createResponse = await request(app.server).post('/users').send({
      email: 'user@example.com',
      password: '123456',
    });
    const userId = createResponse.body.user.id;
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');
    const response = await request(app.server)
      .patch(`/users/${userId}/role`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'MANAGER' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ message: 'Role updated' }),
    );
  });

  it('should not allow non-ADMIN to change user role', async () => {
    const createResponse = await request(app.server).post('/users').send({
      email: 'user2@example.com',
      password: '123456',
    });
    const userId = createResponse.body.user.id;
    const { token } = await createAndAuthenticateUser(app, 'MANAGER');
    const response = await request(app.server)
      .patch(`/users/${userId}/role`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'ADMIN' });
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Only ADMIN can change user roles');
  });

  it('should return 400 if user does not exist', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const response = await request(app.server)
      .patch(`/users/${fakeId}/role`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'USER' });
    expect(response.statusCode).toBe(404);
  });
});
