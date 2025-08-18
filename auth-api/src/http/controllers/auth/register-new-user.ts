import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { ConflictError } from '@/use-cases/@errors/conflict-error';
import { makeCreateUserUseCase } from '@/use-cases/users/factories/make-create-user-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

// SCHEMAS
// Create new user Body Schema

const registerNewUserBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  username: z.string().min(3).max(30).optional(),
  profile: z
    .object({
      name: z.string().min(1).max(50).optional(),
      surname: z.string().min(1).max(50).optional(),
    })
    .optional(),
});

// CONTROLLER
// Create new user controller

export async function registerNewUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password, username, profile } =
    registerNewUserBodySchema.parse(request.body);

  try {
    const createUserUseCase = makeCreateUserUseCase();
    const { user, profile: createdProfile } = await createUserUseCase.execute({
      email,
      password,
      username,
      profile,
    });
    return reply.status(201).send({
      email: user.email,
      profile: createdProfile,
    });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }

    if (error instanceof ConflictError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
}

// ATTRIBUTES
// Swagger documentation for the registerNewUser route

export const registerNewUserSchema = {
  tags: ['Me'],
  summary: 'Register a new user',
  description:
    'Creates a new user account with the provided email, password, and optional profile information.',
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
      },
      password: {
        type: 'string',
        minLength: 6,
        description: 'User password (min 6 characters)',
      },
      username: {
        type: 'string',
        minLength: 3,
        maxLength: 30,
        description: 'Optional username (3-30 characters)',
      },
      profile: {
        type: 'object',
        description: 'Optional profile information',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
            description: 'Optional first name',
          },
          surname: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
            description: 'Optional surname',
          },
        },
        required: [],
      },
    },
    required: ['email', 'password'],
  },
  response: {
    201: {
      description: 'User successfully registered',
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          description: 'User email address',
        },
        profile: {
          type: 'object',
          description: 'User profile information',
          properties: {
            name: {
              type: 'string',
              description: 'First name',
            },
            surname: {
              type: 'string',
              description: 'Surname',
            },
          },
          required: [],
        },
      },
    },
    400: {
      description: 'Invalid input data',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    409: {
      description: 'Email already registered',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
};
