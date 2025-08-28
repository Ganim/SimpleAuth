import { app } from '@/app';
import { createAndAuthenticateUser } from '@/tests/factories/create-and-authenticate-user';
import supertest from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const request = supertest(app.server);

describe('GET /sessions/user/:userId/by-date', () => {
  let userToken: string;
  let adminToken: string;
  let userId: string;

  beforeAll(async () => {
    await app.ready();
    // Cria usuário comum
    const userRes = await request.post('/users').send({
      email: 'user1@example.com',
      password: '123456',
    });
    userId = userRes.body.user.id;
    userToken = (await createAndAuthenticateUser(app, 'USER')).token;
    adminToken = (await createAndAuthenticateUser(app, 'ADMIN')).token;
  });
  afterAll(async () => {
    await app.close();
  });

  it('não permite listar sessões de usuário por data sem autenticação', async () => {
    const res = await request.get(
      `/sessions/user/${userId}/by-date?from=2025-01-01&to=2025-12-31`,
    );
    expect(res.status).toBe(401);
  });

  it('não permite listar sessões de outro usuário por data se eu não for admin', async () => {
    const res = await request
      .get(`/sessions/user/${userId}/by-date?from=2025-01-01&to=2025-12-31`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });

  it('deve listar sessões de um usuário por data se eu for admin', async () => {
    const res = await request
      .get(`/sessions/user/${userId}/by-date?from=2025-01-01&to=2025-12-31`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.sessions).toBeInstanceOf(Array);
  });
});
