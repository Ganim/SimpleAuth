import { app } from '@/app';

import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Change My Profile (e2e)', () => {
  beforeAll(async () => {
    app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should allow a USER to CHANGE their OWN PROFILE', async () => {
    const { token } = await createAndAuthenticateUser(app, 'USER');

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

    expect(response.body.user.profile.name).toBe('NovoNome');
    expect(response.body.user.profile.surname).toBe('NovoSobrenome');
    expect(response.body.user.profile.location).toBe('Portugal');
    expect(response.body.user.profile.bio).toBe('Bio editada');
    expect(response.body.user.profile.avatarUrl).toBe(
      'https://example.com/avatar.png',
    );
  });
});
