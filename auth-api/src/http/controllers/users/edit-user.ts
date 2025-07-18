import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { makeEditProfileUseCase } from '../../../use-cases/auth/factories/make-edit-profile-use-case';
import { makeEditUserUseCase } from '../../../use-cases/users/factories/make-edit-user-use-case';

// Controller para edição de usuário e perfil por MANAGER/ADMIN
const editUserBodySchema = z.object({
  email: z.email().optional(),
  role: z.enum(['USER', 'MANAGER', 'ADMIN']).optional(),
  profile: z
    .object({
      name: z.string().min(1).max(50).optional(),
      surname: z.string().min(1).max(50).optional(),
      bio: z.string().max(255).optional(),
      avatarUrl: z.url().optional(),
    })
    .optional(),
});

export async function editUser(request: FastifyRequest, reply: FastifyReply) {
  // Extrai o id do usuário a ser editado
  const { id } = request.params as { id: string };
  // Valida e extrai os dados do corpo da requisição
  const { email, role, profile } = editUserBodySchema.parse(request.body);

  // Validação: apenas ADMIN pode editar a role
  if (role && request.user.role !== 'ADMIN') {
    return reply
      .status(403)
      .send({ message: 'Only ADMIN can edit user roles' });
  }

  try {
    // Edita dados do usuário
    const editUserUseCase = makeEditUserUseCase();
    await editUserUseCase.execute({ id, email, role });
    // Edita dados do perfil, se enviados
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
