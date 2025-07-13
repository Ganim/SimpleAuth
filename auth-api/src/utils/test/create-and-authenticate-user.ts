import { env } from '@/env';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import type { Role } from 'generated/prisma';

import request from 'supertest';

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  role: Role = 'USER',
) {
  const userResponse = await prisma.user.create({
    data: {
      email: 'johndoe@example.com',
      password_hash: await hash('123456', env.HASH_ROUNDS),
      role,
    },
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  });

  const { token } = authResponse.body;

  return {
    user: userResponse,
    token,
  };
}
