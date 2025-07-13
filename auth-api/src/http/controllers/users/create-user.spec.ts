import { app } from '@/app';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Create User (e2e)', () => {
  beforeAll(async () => {
    app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to create an user', async () => {
    const response = await request(app.server).post('/users').send({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(response.statusCode).toEqual(201);
  });
});
