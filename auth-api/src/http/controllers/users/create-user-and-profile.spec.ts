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

  it('should be able to create an user and profile', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        email: 'johndoe@example.com',
        password: '123456',
        profile: {
          name: 'John',
          surname: 'Doe',
          birthday: '1990-01-01',
          location: 'Brazil',
        },
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body.user).toBeDefined();
    expect(response.body.profile).toBeDefined();
    expect(response.body.profile.name).toBe('John');
    expect(response.body.profile.surname).toBe('Doe');
    expect(new Date(response.body.profile.birthday)).toEqual(
      new Date('1990-01-01'),
    );
    expect(response.body.profile.location).toBe('Brazil');
    expect(response.body.profile.userId).toBe(response.body.user.id);
  });
});
