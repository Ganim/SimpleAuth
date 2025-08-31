import { app } from '@/app';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Authenticate with password (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to authenticate an user and return user/session/token/refreshToken', async () => {
    await request(app.server).post('/register').send({
      email: 'johndoe@example.com',
      password: '123456',
    });

    const response = await request(app.server)
      .post('/auth/password')
      .set('X-Forwarded-For', '127.0.0.1')
      .send({
        email: 'johndoe@example.com',
        password: '123456',
      });

    expect(response.statusCode).toEqual(200);

    expect(response.body).toEqual({
      user: expect.objectContaining({
        id: expect.any(String),
        email: 'johndoe@example.com',
        username: expect.any(String),
        role: expect.any(String),
        lastLoginAt: expect.any(String),
        deletedAt: expect.toBeOneOf([null, undefined]),
        profile: expect.anything(),
      }),
      sessionId: expect.any(String),
      token: expect.any(String),
      refreshToken: expect.any(String),
    });
  });
});
