import { app } from '@/app';
import { MAX_ATTEMPTS } from '@/config/auth';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Authenticate with password (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow ANYONE to AUTHENTICATE with PASSWORD', async () => {
    await request(app.server).post('/v1/auth/register').send({
      email: 'johndoe@example.com',
      password: 'Pass@123',
    });

    const response = await request(app.server).post('/v1/auth/password').send({
      email: 'johndoe@example.com',
      password: 'Pass@123',
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

  it('should BLOCK user after exceeding max FAILED LOGIN ATTEMPTS (e2e)', async () => {
    await request(app.server).post('/v1/auth/register').send({
      email: 'blockme@example.com',
      password: 'Pass@123',
    });

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const response = await request(app.server)
        .post('/v1/auth/password')
        .send({
          email: 'blockme@example.com',
          password: 'wrongpassword',
        });
      if (i < MAX_ATTEMPTS - 1) {
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(
          expect.objectContaining({ message: 'Invalid credentials' }),
        );
      } else {
        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual(
          expect.objectContaining({
            message: 'User is temporarily blocked due to failed login attempts',
            blockedUntil: expect.any(String),
          }),
        );
      }
    }

    const blockedResponse = await request(app.server)
      .post('/v1/auth/password')
      .send({
        email: 'blockme@example.com',
        password: 'Pass@123',
      });

    expect(blockedResponse.statusCode).toBe(403);
    expect(blockedResponse.body).toEqual(
      expect.objectContaining({
        message: 'User is temporarily blocked due to failed login attempts',
        blockedUntil: expect.any(String),
      }),
    );
  });
});
