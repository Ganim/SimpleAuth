import { Email } from '@/entities/core/value-objects/email';
import { Password } from '@/entities/core/value-objects/password';
import { prisma } from '@/lib/prisma';
import { faker } from '@faker-js/faker';
import type { FastifyInstance } from 'fastify';
import type { Role } from 'generated/prisma';

import request from 'supertest';

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  role: Role = 'USER',
) {
  const fakerEmail = faker.internet.email();
  const emailValueObject = new Email(fakerEmail);
  const username = `user${Date.now()}`;

  const userResponse = await prisma.user.create({
    data: {
      email: emailValueObject.value,
      password_hash: await Password.hash('123456'),
      role,
      username,
    },
  });

  await prisma.userProfile.create({
    data: {
      userId: userResponse.id,
    },
  });

  const authResponse = await request(app.server).post('/auth/password').send({
    email: emailValueObject.value,
    password: '123456',
  });

  const { token, sessionId } = authResponse.body;

  return {
    user: userResponse,
    token,
    sessionId,
  };
}
