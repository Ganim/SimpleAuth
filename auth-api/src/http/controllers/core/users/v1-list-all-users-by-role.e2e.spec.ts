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

  it('should allow ADMIN to LIST ALL users BY ROLE', async () => {
    const { token: adminToken } = await createAndAuthenticateUser(app, 'ADMIN');
    const { token: managerToken } = await createAndAuthenticateUser(
      app,
      'MANAGER',
    );

    await request(app.server)
      .post('/v1/users')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        email: 'user@example.com',
        password: 'Pass@123',
      });

    const adminResponse = await request(app.server)
      .get('/v1/users/role/USER')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(adminResponse.status).toBe(200);

    expect(Array.isArray(adminResponse.body.users)).toBe(true);

    const managerResponse = await request(app.server)
      .get('/v1/users/role/USER')
      .set('Authorization', `Bearer ${managerToken}`);

    expect(managerResponse.status).toBe(403);
  });
});
