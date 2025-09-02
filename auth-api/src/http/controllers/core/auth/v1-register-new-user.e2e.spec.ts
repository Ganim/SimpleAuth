import { app } from '@/app';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Register New User (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow ANYONE to REGISTER a NEW USER', async () => {
    const response = await request(app.server).post('/v1/auth/register/password').send({
      email: 'johndoe@example.com',
      password: 'Pass@123',
    });

    expect(response.statusCode).toEqual(201);
  });
});
