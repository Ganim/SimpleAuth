import { app } from '@/app';
import { prisma } from '@/lib/prisma';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Refresh Session (e2e)', () => {
  let token: string;
  let sessionId: string;

  beforeAll(async () => {
    await app.ready();
    await request(app.server).post('/users').send({
      email: 'johndoe@example.com',
      password: '123456',
    });
    const authRes = await request(app.server)
      .post('/sessions')
      .send({ email: 'johndoe@example.com', password: '123456' });
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

    // Valida se a sessão foi atualizada
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    expect(session?.lastUsedAt).toBeInstanceOf(Date);
    expect(session?.ip).toBeDefined();
  });

  it('deve retornar 400 se não enviar sessionId', async () => {
    const res = await request(app.server)
      .post('/sessions/refresh')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
  });
});
