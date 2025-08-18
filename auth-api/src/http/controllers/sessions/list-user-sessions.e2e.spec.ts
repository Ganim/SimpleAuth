import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import supertest from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const request = supertest(app.server);

describe('List User Sessions (e2e)', () => {
  let userToken: string;
  let adminToken: string;
  let userId: string;

  beforeAll(async () => {
    await app.ready();
    // Cria usuário comum
    const userRes = await request.post('/users').send({
      email: 'user2@example.com',
      password: '123456',
    });
    userId = userRes.body.user.id;
    userToken = (await createAndAuthenticateUser(app, 'USER')).token;
    adminToken = (await createAndAuthenticateUser(app, 'ADMIN')).token;
  });
  afterAll(async () => {
    await app.close();
  });

  it('não permite listar sessões de usuário sem autenticação', async () => {
    const res = await request.get(`/sessions/user/${userId}`);
    expect(res.status).toBe(401);
  });

  it('não permite listar sessões de outro usuário se eu não for admin', async () => {
    const res = await request
      .get(`/sessions/user/${userId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });

  it('deve listar todas as sessões de um usuário se eu for admin', async () => {
    const res = await request
      .get(`/sessions/user/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.sessions).toBeInstanceOf(Array);
  });
});
