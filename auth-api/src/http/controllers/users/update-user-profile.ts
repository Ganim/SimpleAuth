import { PrismaProfilesRepository } from '@/repositories/prisma/prisma-profiles-repository';
import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { UpdateUserProfileUseCase } from '@/use-cases/users/update-user-profile';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const updateUserProfileBodySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  surname: z.string().min(1).max(50).optional(),
  birthday: z.coerce.date().optional(),
  location: z.string().max(128).optional(),
  bio: z.string().max(255).optional(),
  avatarUrl: z.string().url().optional(),
});

export async function updateUserProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string };
  const body = updateUserProfileBodySchema.parse(request.body);

  try {
    const profilesRepository = new PrismaProfilesRepository();
    const updateUserProfileUseCase = new UpdateUserProfileUseCase(
      profilesRepository,
    );
    const { profile } = await updateUserProfileUseCase.execute({
      userId: id,
      ...body,
    });
    return reply.status(200).send({
      message: 'User profile updated',
      profile,
    });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    if (error instanceof Error && error.message === 'Profile not found') {
      return reply.status(400).send({ message: 'User not found' });
    }
    return reply.status(400).send({ message: 'User not found' });
  }
}
