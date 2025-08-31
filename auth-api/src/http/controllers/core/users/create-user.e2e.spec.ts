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

  it('should allow MANAGER/ADMIN to CREATE a NEW USER', async () => {
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

    expect(response.body.user.email).toBe('johndoe@example.com');
    expect(response.body.user.profile).toBeDefined();
    expect(response.body.user.profile.name).toBe('John');
    expect(response.body.user.profile.surname).toBe('Doe');
    expect(new Date(response.body.user.profile.birthday)).toEqual(
      new Date('1990-01-01'),
    );
    expect(response.body.user.profile.location).toBe('Brazil');
  });
});
