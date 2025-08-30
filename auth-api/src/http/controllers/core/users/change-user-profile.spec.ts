import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Update User (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow MANAGER/ADMIN to update username and profile', async () => {
    const createResponse = await request(app.server).post('/users').send({
      email: 'edituser@example.com',
      password: '123456',
    });
    const userId = createResponse.body.user.id;
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');
    const response = await request(app.server)
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'editeduser',
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
        profile: expect.objectContaining({
          name: 'NovoNome',
          surname: 'NovoSobrenome',
          bio: 'Bio editada',
          avatarUrl: 'https://example.com/avatar.png',
        }),
      }),
    );
  });

  it('should return 400 if user does not exist', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const response = await request(app.server)
      .patch(`/users/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ profile: { name: 'fail' } });
    expect(response.statusCode).toBe(404);
  });
});
