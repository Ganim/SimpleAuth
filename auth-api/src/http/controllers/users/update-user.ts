import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { makeUpdateUserUseCase } from '../../../use-cases/users/factories/make-update-user-use-case';

// Controller para edição de usuário e perfil por MANAGER/ADMIN
const updateUserBodySchema = z.object({
  username: z.string().min(3).max(30).optional(),
  profile: z
    .object({
      name: z.string().min(1).max(50).optional(),
      surname: z.string().min(1).max(50).optional(),
      birthday: z.coerce.date().optional(),
      location: z.string().max(128).optional(),
      bio: z.string().max(255).optional(),
      avatarUrl: z.string().url().optional(),
    })
    .optional(),
});

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const { username, profile } = updateUserBodySchema.parse(request.body);

  try {
    const updateUserUseCase = makeUpdateUserUseCase();
    await updateUserUseCase.execute({ id, username, profile });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
  return reply.status(200).send({ message: 'User and profile updated' });
}
