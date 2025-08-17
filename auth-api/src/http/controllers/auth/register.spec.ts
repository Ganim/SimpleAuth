import { app } from '@/app';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Register User (e2e)', () => {
  beforeAll(async () => {
    app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should register user with all fields', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        email: 'johndoe@example.com',
        password: '123456',
        username: 'johnny',
        profile: {
          name: 'John',
          surname: 'Doe',
        },
      });
    expect(response.statusCode).toEqual(201);
    expect(response.body.email).toBe('johndoe@example.com');
    expect(response.body.profile).toBeDefined();
    expect(response.body.profile.name).toBe('John');
    expect(response.body.profile.surname).toBe('Doe');
  });

  it('should register user without username', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        email: 'janedoe@example.com',
        password: '123456',
        profile: {
          name: 'Jane',
          surname: 'Doe',
        },
      });
    expect(response.statusCode).toEqual(201);
    expect(response.body.email).toBe('janedoe@example.com');
    expect(response.body.profile).toBeDefined();
    expect(response.body.profile.name).toBe('Jane');
    expect(response.body.profile.surname).toBe('Doe');
  });

  it('should register user without profile', async () => {
    const response = await request(app.server).post('/users').send({
      email: 'noprof@example.com',
      password: '123456',
      username: 'noprof',
    });
    expect(response.statusCode).toEqual(201);
    expect(response.body.email).toBe('noprof@example.com');
    expect(response.body.profile).toBeDefined();
  });

  it('should register user without username and profile', async () => {
    const response = await request(app.server).post('/users').send({
      email: 'minimal@example.com',
      password: '123456',
    });
    expect(response.statusCode).toEqual(201);
    expect(response.body.email).toBe('minimal@example.com');
    expect(response.body.profile).toBeDefined();
  });
});
