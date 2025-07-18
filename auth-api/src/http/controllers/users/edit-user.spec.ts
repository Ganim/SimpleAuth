import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// Teste de edição de usuário e perfil por MANAGER/ADMIN

describe('Edit User (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow MANAGER/ADMIN to edit user and profile', async () => {
    // Cria usuário
    const createResponse = await request(app.server).post('/users').send({
      email: 'edituser@example.com',
      password: '123456',
    });
    const userId = createResponse.body.user.id;

    // Autentica como ADMIN
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    // Edita usuário e perfil
    const response = await request(app.server)
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'edited@example.com',
        role: 'MANAGER',
        profile: {
          name: 'NovoNome',
          surname: 'NovoSobrenome',
          bio: 'Bio editada',
          avatarUrl: 'https://example.com/avatar.png',
        },
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'User and profile updated',
      }),
    );
  });

  it('should not allow MANAGER to edit user role', async () => {
    // Cria usuário
    const createResponse = await request(app.server).post('/users').send({
      email: 'editmanager@example.com',
      password: '123456',
    });
    const userId = createResponse.body.user.id;

    // Autentica como MANAGER
    const { token } = await createAndAuthenticateUser(app, 'MANAGER');

    // Tenta editar role
    const response = await request(app.server)
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        role: 'ADMIN',
      });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Only ADMIN can edit user roles');
  });

  it('should return 400 if user does not exist', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');
    const response = await request(app.server)
      .patch(`/users/nonexistentid`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'fail@example.com' });
    expect(response.statusCode).toBe(400);
  });
});
