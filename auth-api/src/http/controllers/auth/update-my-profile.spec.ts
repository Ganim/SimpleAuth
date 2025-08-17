import { app } from '@/app';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
// ...existing code...
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

let token: string;

describe('E2E - /me/profile', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    const user = await prisma.user.create({
      data: {
        email: 'e2eprofile@example.com',
        password_hash: await hash('123456', 8),
        username: 'e2eprofile',
        role: 'USER',
        profile: {
          create: {
            name: 'Old',
            surname: 'Name',
            location: 'Brazil',
          },
        },
      },
      include: { profile: true },
    });
    const response = await request(app.server)
      .post('/sessions')
      .send({ email: user.email, password: '123456' });
    token = response.body.token;
  });

  it('deve atualizar o perfil do próprio usuário', async () => {
    const response = await request(app.server)
      .patch('/me/update/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'NovoNome',
        surname: 'NovoSobrenome',
        location: 'Portugal',
        bio: 'Bio editada',
        avatarUrl: 'url',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.profile.name).toBe('NovoNome');
    expect(response.body.profile.surname).toBe('NovoSobrenome');
    expect(response.body.profile.location).toBe('Portugal');
    expect(response.body.profile.bio).toBe('Bio editada');
    expect(response.body.profile.avatarUrl).toBe('url');
  });
});
