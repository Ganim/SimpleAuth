import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import supertest from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const request = supertest(app.server);

describe('POST /sessions/revoke', () => {
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

  it('não permite revogar sessão sem autenticação', async () => {
    const res = await request
      .post('/sessions/revoke')
      .send({ sessionId: 'anyid' });
    expect(res.status).toBe(401);
  });

  it('não permite revogar sessão se eu não for admin', async () => {
    const res = await request
      .post('/sessions/revoke')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ sessionId: 'anyid' });
    expect(res.status).toBe(403);
  });

  it('deve revogar uma sessão se eu for admin', async () => {
    // Cria usuário e autentica para obter sessionId real
    await request
      .post('/users')
      .send({ email: 'revoketest@example.com', password: '123456' });
    const loginRes = await request
      .post('/sessions')
      .send({ email: 'revoketest@example.com', password: '123456' });
    const sessionId = loginRes.body.sessionId;
    const res = await request
      .post('/sessions/revoke')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ sessionId });
    expect(res.status).toBe(204);
  });
});
