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

describe('E2E - /me/change/username', () => {
  let token: string;

  beforeAll(async () => {
    await prisma.user.deleteMany();
    const result = await createUserAndGetToken();
    token = result.token;
  });

  it('altera o username do próprio usuário', async () => {
    const response = await request(app.server)
      .patch('/me/change/username')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'novousername' });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Username updated');
  });
});
