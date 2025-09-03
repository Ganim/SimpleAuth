import { makeCreateUserUseCase } from '@/use-cases/core/users/factories/make-create-user-use-case';
import { faker } from '@faker-js/faker';
import type { Role as PrismaRole } from '@prisma/client';
import type { FastifyInstance } from 'fastify';

import request from 'supertest';

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  role: PrismaRole = 'USER',
) {
  const fakeEmail = faker.internet.email();
  const username = `user${faker.string.uuid().slice(0, 8)}`;

  const createUserUseCase = makeCreateUserUseCase();
  const userResponse = await createUserUseCase.execute({
    email: fakeEmail,
    password: 'Pass@123',
    username,
    role,
  });

  const authResponse = await request(app.server)
    .post('/v1/auth/login/password')
    .send({
      email: fakeEmail,
      password: 'Pass@123',
    });

  const { token, refreshToken, sessionId } = authResponse.body;

  return {
    user: userResponse,
    token,
    refreshToken,
    sessionId,
  };
}
