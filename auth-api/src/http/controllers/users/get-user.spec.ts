import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('GetUser (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should return user and profile for MANAGER/ADMIN', async () => {
    // Cria usuário
    const createResponse = await request(app.server).post('/users').send({
      email: 'getuser@example.com',
      password: '123456',
    });
    const userId = createResponse.body.user.id;
    // Autentica como MANAGER
    const { token } = await createAndAuthenticateUser(app, 'MANAGER');
    // Busca usuário
    const response = await request(app.server)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.user.id).toBe(userId);
    expect(response.body.profile.userId).toBe(userId);
  });

  it('should return 400 if user not found', async () => {
    const { token } = await createAndAuthenticateUser(app, 'MANAGER');
    const response = await request(app.server)
      .get(`/users/nonexistentid`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect([400, 404]).toContain(response.statusCode);
  });
});
