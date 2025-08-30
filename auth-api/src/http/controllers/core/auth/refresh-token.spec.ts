import { app } from '@/app';
import { prisma } from '@/lib/prisma';
import { createAndAuthenticateUser } from '@/utils/tests/factories/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Refresh token (e2e)', () => {
  let token: string;
  let sessionId: string;

  beforeAll(async () => {
    await app.ready();
    const { token: userToken, sessionId: userSessionId } =
      await createAndAuthenticateUser(app, 'USER');
    token = userToken;
    sessionId = userSessionId;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should update session with new IP', async () => {
    const res = await request(app.server)
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${token}`)
      .send({ sessionId });
    expect(res.status).toBe(200);

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
