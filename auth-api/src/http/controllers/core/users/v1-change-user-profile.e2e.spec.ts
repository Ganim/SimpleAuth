import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import { makeUniqueEmail } from '@/utils/tests/factories/core/make-unique-email';
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

    const email = makeUniqueEmail('change-user-profile');
    const anotherUser = await request(app.server)
      .post('/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email,
        password: 'Pass@123',
      });

    const userId = anotherUser.body.user?.id;

    const response = await request(app.server)
      .patch(`/v1/users/${userId}`)
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
