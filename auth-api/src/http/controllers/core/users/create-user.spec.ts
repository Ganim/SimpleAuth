import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Create User (e2e)', () => {
  beforeAll(async () => {
    app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to a MANAGER OR ADMIN create an user and profile', async () => {
    const { token } = await createAndAuthenticateUser(app, 'MANAGER');
    const response = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
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
    expect(response.body.email).toBe('johndoe@example.com');
    expect(response.body.profile).toBeDefined();
    expect(response.body.profile.name).toBe('John');
    expect(response.body.profile.surname).toBe('Doe');
    expect(new Date(response.body.profile.birthday)).toEqual(
      new Date('1990-01-01'),
    );
    expect(response.body.profile.location).toBe('Brazil');
  });
});
