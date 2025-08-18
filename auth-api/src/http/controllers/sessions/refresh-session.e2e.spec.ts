import { app } from '@/app';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('POST /sessions/refresh (e2e)', () => {
  let token: string;
  let sessionId: string;

  beforeAll(async () => {
    await app.ready();
    await request(app.server).post('/users').send({
      email: 'refresh@example.com',
      password: '123456',
    });
    const authRes = await request(app.server)
      .post('/sessions')
      .send({ email: 'refresh@example.com', password: '123456' });
    token = authRes.body.token;
    sessionId = authRes.body.sessionId;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should update session with new IP', async () => {
    const res = await request(app.server)
      .post('/sessions/refresh')
      .set('Authorization', `Bearer ${token}`)
      .send({ sessionId });
    expect(res.status).toBe(204);
  });

  it('should return 400 if sessionId is not provided', async () => {
    const res = await request(app.server)
      .post('/sessions/refresh')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
  });
});
