import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/create-and-authenticate-user';
import supertest from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const request = supertest(app.server);

describe('GET /sessions/me', () => {
  let userToken: string;

  beforeAll(async () => {
    await app.ready();
    userToken = (await createAndAuthenticateUser(app, 'USER')).token;
  });
  afterAll(async () => {
    await app.close();
  });

  it('não permite listar minhas sessões sem autenticação', async () => {
    const res = await request.get('/sessions/me');
    expect(res.status).toBe(401);
  });

  it('deve listar todas as minhas sessões se eu estiver autenticado', async () => {
    const res = await request
      .get('/sessions/me')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.sessions).toBeInstanceOf(Array);
  });
});
