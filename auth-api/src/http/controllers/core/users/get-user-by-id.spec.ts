import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Get User By ID (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should return user and profile for any authenticated user', async () => {
    const { token } = await createAndAuthenticateUser(app, 'MANAGER');

    // Cria usuário
    const createResponse = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'getuser2@example.com',
        password: '123456',
      });

    expect(createResponse.statusCode).toBe(201);

    const userId = createResponse.body.user.id;

    // Busca usuário
    const response = await request(app.server)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.user.id).toBe(userId);
    expect(response.body.profile.userId).toBe(userId);
  });

  it('should return 400 if user not found', async () => {
    const { token } = await createAndAuthenticateUser(app, 'MANAGER');
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const response = await request(app.server)
      .get(`/users/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect([400, 404]).toContain(response.statusCode);
  });
});
