import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('DeleteUser (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should delete user ', async () => {
    // Cria usuário
    const createResponse = await request(app.server).post('/users').send({
      email: 'deleteuser@example.com',
      password: '123456',
    });
    const userId = createResponse.body.user.id;
    // Autentica como ADMIN
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');
    // Deleta usuário
    const response = await request(app.server)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(response.statusCode).toBe(200);
    // Tenta buscar o usuário
    const userResponse = await request(app.server)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect([400, 404]).toContain(userResponse.statusCode);
  });

  it('should return 400 if user not found', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');
    const response = await request(app.server)
      .delete(`/users/nonexistentid`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(response.statusCode).toBe(400);
  });
});
