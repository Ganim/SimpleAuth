import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeCreateUserUseCase } from '@/use-cases/users/factories/make-create-user-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
export const createUserBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  profile: z
    .object({
      name: z.string().min(1).max(32).optional(),
      surname: z.string().min(1).max(32).optional(),
      birthday: z.coerce.date().optional(),
      location: z.string().max(128).optional(),
      avatarUrl: z.string().max(256).optional(),
    })
    .optional(),
});

// CONTROLLER
export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const { email, password, profile } = createUserBodySchema.parse(request.body);
  try {
    const createUserUseCase = makeCreateUserUseCase();
    const { user, profile: createdProfile } = await createUserUseCase.execute({
      email,
      password,
      profile,
    });
    return reply
      .status(201)
      .send({ user, email: user.email, profile: createdProfile });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}

// ATTRIBUTES
export const createUserSchema = {
  tags: ['Users'],
  summary: 'Create a new user',
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email', description: 'User email' },
      password: { type: 'string', minLength: 6, description: 'User password' },
      profile: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 32,
            description: 'Name',
          },
          surname: {
            type: 'string',
            minLength: 1,
            maxLength: 32,
            description: 'Surname',
          },
          birthday: { type: 'string', format: 'date', description: 'Birthday' },
          location: { type: 'string', maxLength: 128, description: 'Location' },
          avatarUrl: {
            type: 'string',
            maxLength: 256,
            description: 'Avatar URL',
          },
        },
        additionalProperties: false,
      },
    },
    required: ['email', 'password'],
    additionalProperties: false,
  },
  response: {
    201: {
      description: 'User created',
      type: 'object',
      properties: {
        user: { type: 'object' },
        email: { type: 'string' },
        profile: { type: 'object' },
      },
      required: ['user', 'email', 'profile'],
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: { message: { type: 'string' } },
      required: ['message'],
    },
  },
};
