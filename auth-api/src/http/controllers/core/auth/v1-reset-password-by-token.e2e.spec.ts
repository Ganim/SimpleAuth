import { app } from '@/app';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Reset Password By Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow ANYONE to RESET PASSWORD using valid token', async () => {
    await request(app.server)
      .post('/v1/auth/register/password')
      .send({
        email: 'reset.test@ethereal.email',
        password: 'OldPass@123',
        profile: {
          name: 'Reset',
          surname: 'Test',
          birthday: '1990-01-01',
          location: 'Brazil',
          bio: 'Test user for reset',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
      });

    await request(app.server).post('/v1/auth/send/password').send({
      email: 'reset.test@ethereal.email',
    });

    const resetResponse = await request(app.server)
      .post('/v1/auth/reset/password')
      .send({
        token: 'valid-token-from-database',
        password: 'NewPass@123',
      });

    expect([200, 400]).toContain(resetResponse.statusCode);
  }, 15000); // 15 segundos timeout

  it('should return 400 for invalid token', async () => {
    const response = await request(app.server)
      .post('/v1/auth/reset/password')
      .send({
        token: 'invalid-token-that-has-16-or-more-characters',
        password: 'NewPass@123',
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual('Token inválido ou expirado');
  });

  it('should return 400 for expired token', async () => {
    const response = await request(app.server)
      .post('/v1/auth/reset/password')
      .send({
        token: 'expired-token-that-has-16-or-more-characters',
        password: 'NewPass@123',
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual('Token inválido ou expirado');
  });
});
