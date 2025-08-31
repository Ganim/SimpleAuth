import { app } from '@/app';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Register New User (e2e)', () => {
  beforeAll(async () => {
    app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow ANYONE to REGISTER a NEW USER', async () => {
    const response = await request(app.server)
      .post('/register')
      .send({
        email: 'johndoe@example.com',
        password: '123456',
        username: 'johnny',
        profile: {
          name: 'John',
          surname: 'Doe',
          birthday: '1990-01-01',
          location: 'USA',
        },
      });

    expect(response.statusCode).toEqual(201);

    expect(response.body.user.email).toBe('johndoe@example.com');
    expect(response.body.user.profile).toBeDefined();
    expect(response.body.user.profile.name).toBe('John');
    expect(response.body.user.profile.surname).toBe('Doe');
    expect(response.body.user.profile.birthday.slice(0, 10)).toBe('1990-01-01');
    expect(response.body.user.profile.location).toBe('USA');
  });
});
