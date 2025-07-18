import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeEditProfileUseCase } from '@/use-cases/auth/factories/make-edit-profile-use-case';
import { makeEditUserUseCase } from '@/use-cases/users/factories/make-edit-user-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const editMeBodySchema = z.object({
  email: z.email().optional(),
  profile: z
    .object({
      name: z.string().min(1).max(50).optional(),
      surname: z.string().min(1).max(50).optional(),
      bio: z.string().max(255).optional(),
      avatarUrl: z.url().optional(),
    })
    .optional(),
});

export async function editMe(request: FastifyRequest, reply: FastifyReply) {
  const { email, profile } = editMeBodySchema.parse(request.body);
  const id = request.user.sub;

  try {
    const editUserUseCase = makeEditUserUseCase();
    await editUserUseCase.execute({ id, email });
    if (profile) {
      const editProfileUseCase = makeEditProfileUseCase();
      await editProfileUseCase.execute({ userId: id, ...profile });
    }
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }

  return reply.status(200).send({ message: 'User and profile updated' });
}
