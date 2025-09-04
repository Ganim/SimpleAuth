import { app } from '@/app';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Send Password Reset Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow ANYONE to REQUEST a PASSWORD RESET TOKEN', async () => {
    await request(app.server)
      .post('/v1/auth/register/password')
      .send({
        email: 'leila.ernser@ethereal.email',
        password: 'Pass@123',
        profile: {
          name: 'Leila',
          surname: 'Ernser',
          birthday: '1990-01-01',
          location: 'Brazil',
          bio: 'Test user',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
      });

    const response = await request(app.server)
      .post('/v1/auth/send/password')
      .send({
        email: 'leila.ernser@ethereal.email',
      });

    expect(response.statusCode).toEqual(200);
  }, 15000);
});
