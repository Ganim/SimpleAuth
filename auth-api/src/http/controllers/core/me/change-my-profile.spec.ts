import { app } from '@/app';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

let token: string;

describe('Change My Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
    const { token: userToken } = await createAndAuthenticateUser(app, 'USER');
    token = userToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should update own user profile', async () => {
    const response = await request(app.server)
      .patch('/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        profile: {
          name: 'NovoNome',
          surname: 'NovoSobrenome',
          location: 'Portugal',
          bio: 'Bio editada',
          avatarUrl: 'https://example.com/avatar.png',
        },
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.profile.name).toBe('NovoNome');
    expect(response.body.profile.surname).toBe('NovoSobrenome');
    expect(response.body.profile.location).toBe('Portugal');
    expect(response.body.profile.bio).toBe('Bio editada');
    expect(response.body.profile.avatarUrl).toBe(
      'https://example.com/avatar.png',
    );
  });
});
