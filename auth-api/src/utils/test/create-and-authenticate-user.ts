import { env } from '@/env';
import { prisma } from '@/lib/prisma';
import { faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import type { Role } from 'generated/prisma';

import request from 'supertest';

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  role: Role = 'USER',
) {
  const fakerEmail = faker.internet.email();

  const userResponse = await prisma.user.create({
    data: {
      email: fakerEmail,
      password_hash: await hash('123456', env.HASH_ROUNDS),
      role,
    },
  });

  await prisma.profile.create({
    data: {
      userId: userResponse.id,
    },
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email: fakerEmail,
    password: '123456',
  });

  const { token } = authResponse.body;

  return {
    user: userResponse,
    token,
  };
}
