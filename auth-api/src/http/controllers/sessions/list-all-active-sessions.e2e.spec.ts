import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/factories/create-and-authenticate-user';
import supertest from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const request = supertest(app.server);

describe('GET /sessions/active', () => {
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

  it('should not allow listing active sessions without authentication', async () => {
    const res = await request.get('/sessions/active');
    expect(res.status).toBe(401);
  });

  it('should not allow listing active sessions if not admin', async () => {
    const res = await request
      .get('/sessions/active')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });

  it('should list all active sessions if user is admin', async () => {
    const res = await request
      .get('/sessions/active')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.sessions).toBeInstanceOf(Array);
  });
});
