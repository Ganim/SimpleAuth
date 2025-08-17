import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Change User Password (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow user to change password', async () => {
    const createResponse = await request(app.server).post('/users').send({
      email: 'user@example.com',
      password: '123456',
    });
    const userId = createResponse.body.user.id;
    const { token } = await createAndAuthenticateUser(app, 'USER');
    const response = await request(app.server)
      .patch(`/users/${userId}/password`)
      .set('Authorization', `Bearer ${token}`)
      .send({ password: 'newpass123' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ message: 'Password updated' }),
    );
  });

  it('should return 400 if user does not exist', async () => {
    const { token } = await createAndAuthenticateUser(app, 'USER');
    const response = await request(app.server)
      .patch(`/users/nonexistentid/password`)
      .set('Authorization', `Bearer ${token}`)
      .send({ password: 'failpass' });
    expect(response.statusCode).toBe(400);
  });
});
