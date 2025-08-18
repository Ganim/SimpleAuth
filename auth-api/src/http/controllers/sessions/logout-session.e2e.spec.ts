import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

describe('POST /sessions/logout (e2e)', () => {
  let token: string;
  let sessionId: string;
  let email: string;

  beforeAll(async () => {
    await app.ready();
    const { token: userToken, user } = await createAndAuthenticateUser(app);
    token = userToken;
    email = user.email;
    const res = await request(app.server)
      .post('/sessions')
      .send({ email, password: '123456' });
    sessionId = res.body.sessionId;
  });

  it('should revoke session and refresh token', async () => {
    const res = await request(app.server)
      .post('/sessions/logout')
      .set('Authorization', `Bearer ${token}`)
      .send({ sessionId });
    expect(res.status).toBe(204);
  });

  it('should return 400 if sessionId is not provided', async () => {
    const res = await request(app.server)
      .post('/sessions/logout')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
  });
});
