import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/core/create-and-authenticate-user.e2e';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('List all Users By Role (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should allow only admin to list users by role', async () => {
    const { token: adminToken } = await createAndAuthenticateUser(app, 'ADMIN');
    const { token: managerToken } = await createAndAuthenticateUser(
      app,
      'MANAGER',
    );

    await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'user-1@example.com',
        password: '123456',
        role: 'USER',
      });

    // Admin pode listar
    const resAdmin = await request(app.server)
      .get('/users/role/USER')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(resAdmin.status).toBe(200);
    expect(Array.isArray(resAdmin.body.users)).toBe(true);

    // Manager não pode listar
    const resManager = await request(app.server)
      .get('/users/role/USER')
      .set('Authorization', `Bearer ${managerToken}`);
    expect(resManager.status).toBe(403);
  });

  it('should return only users of the requested role', async () => {
    await request(app.server).post('/users').send({
      email: 'user-2@example.com',
      password: '123456',
      role: 'USER',
    });

    const { token: adminToken } = await createAndAuthenticateUser(app, 'ADMIN');

    const res = await request(app.server)
      .get('/users/role/USER')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    type UserResponse = {
      id: string;
      username: string;
      email: string;
      role: string;
      profile: {
        name: string;
        surname: string;
        birthday: string;
        location: string;
        bio: string;
        avatarUrl: string;
      };
    };
    expect(
      (res.body.users as UserResponse[]).every((u) => u.role === 'USER'),
    ).toBe(true);
  });
});
