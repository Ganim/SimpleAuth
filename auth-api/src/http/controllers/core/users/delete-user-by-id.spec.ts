import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Delete User By Id (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should delete user ', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    // Cria usuário
    const createResponse = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'DeleteUserById@example.com',
        password: '123456',
      });

    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.body.profile).toBeDefined();
    expect(createResponse.body.profile.userId).toBeDefined();

    const userId = createResponse.body.user.id;

    // Deleta usuário
    const response = await request(app.server)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'ADMIN' });

    expect(response.statusCode).toBe(200);

    // Tenta buscar o usuário
    const userResponse = await request(app.server)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(userId).toBeDefined();
    expect(userResponse.statusCode).toBe(404);
  });

  it('should return 400 if user not found', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    const fakeId = '00000000-0000-0000-0000-000000000000';

    const response = await request(app.server)
      .delete(`/users/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'ADMIN' });
    expect(response.statusCode).toBe(404);
  });
});
