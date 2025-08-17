import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { makeUpdateMyProfileUseCase } from '@/use-cases/auth/factories/make-update-my-profile-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const updateMyProfileBodySchema = z.object({
  name: z.string().optional(),
  surname: z.string().optional(),
  birthday: z.coerce.date().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export async function updateMyProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub;
  const body = updateMyProfileBodySchema.parse(request.body);
  try {
    const updateMyProfileUseCase = makeUpdateMyProfileUseCase();
    const { profile } = await updateMyProfileUseCase.execute({
      userId,
      ...body,
    });
    return reply.status(200).send({ profile });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}
