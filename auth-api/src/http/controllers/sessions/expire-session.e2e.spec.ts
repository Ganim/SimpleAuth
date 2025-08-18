import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import supertest from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const request = supertest(app.server);

describe('POST /sessions/expire', () => {
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    await app.ready();
    userToken = (await createAndAuthenticateUser(app, 'USER')).token;
    adminToken = (await createAndAuthenticateUser(app, 'ADMIN')).token;
  });
  afterAll(async () => {
    await app.close();
  });

  it('não permite expirar sessão sem autenticação', async () => {
    const res = await request
      .post('/sessions/expire')
      .send({ sessionId: 'anyid' });
    expect(res.status).toBe(401);
  });

  it('não permite expirar sessão se eu não for admin', async () => {
    const res = await request
      .post('/sessions/expire')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ sessionId: 'anyid' });
    expect(res.status).toBe(403);
  });

  it('deve expirar uma sessão se eu for admin', async () => {
    // Cria usuário e autentica para obter sessionId real
    await request
      .post('/users')
      .send({ email: 'expiretest@example.com', password: '123456' });
    const loginRes = await request
      .post('/sessions')
      .send({ email: 'expiretest@example.com', password: '123456' });
    const sessionId = loginRes.body.sessionId;
    const res = await request
      .post('/sessions/expire')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ sessionId });
    expect(res.status).toBe(204);
  });
});
