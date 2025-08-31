import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Update User Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow MANAGER/ADMIN to CHANGE another user PROFILE', async () => {
    const { token } = await createAndAuthenticateUser(app, 'MANAGER');

    const anotherUser = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'user@example.com',
        password: '123456',
      });

    const userId = anotherUser.body.user?.id;

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

    expect(response.body.user.profile).toEqual(
      expect.objectContaining({
        name: 'NovoNome',
        surname: 'NovoSobrenome',
        bio: 'Bio editada',
        avatarUrl: 'https://example.com/avatar.png',
      }),
    );
  });
});
