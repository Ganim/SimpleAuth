import { app } from '@/app';
import { prisma } from '@/lib/prisma';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

async function createUserAndGetToken() {
  const email = `user${Date.now()}@example.com`;
  const password = '123456';
  await request(app.server).post('/register').send({ email, password });
  const response = await request(app.server)
    .post('/sessions')
    .send({ email, password });
  return { token: response.body.token, email, password };
}

describe('E2E - /me/change/email', () => {
  let token: string;

  beforeAll(async () => {
    await prisma.user.deleteMany();
    const result = await createUserAndGetToken();
    token = result.token;
  });

  it('altera o email do próprio usuário', async () => {
    const response = await request(app.server)
      .patch('/me/change/email')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'novoemail@example.com' });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Email updated');
  });
});
