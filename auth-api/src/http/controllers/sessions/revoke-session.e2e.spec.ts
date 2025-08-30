import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/create-and-authenticate-user';
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

  it('should not allow revoking session without authentication', async () => {
    const res = await request
      .post('/sessions/revoke')
      .send({ sessionId: 'anyid' });
    expect(res.status).toBe(401);
  });

  it('should not allow revoking session if not admin', async () => {
    const res = await request
      .post('/sessions/revoke')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ sessionId: 'anyid' });
    expect(res.status).toBe(403);
  });

  it('should revoke a session if user is admin', async () => {
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
