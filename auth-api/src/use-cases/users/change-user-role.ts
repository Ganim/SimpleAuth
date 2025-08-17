import type { UsersRepository } from '@/repositories/users-repository';
import type { User } from 'generated/prisma';
import { BadRequestError } from '../@errors/bad-request-error';

interface ChangeUserRoleUseCaseRequest {
  id: string;
  role: 'USER' | 'MANAGER' | 'ADMIN';
}

interface ChangeUserRoleUseCaseResponse {
  user: User;
}

export class ChangeUserRoleUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    role,
  }: ChangeUserRoleUseCaseRequest): Promise<ChangeUserRoleUseCaseResponse> {
    const user = await this.usersRepository.findById(id);
    if (!user || user.deletedAt) throw new BadRequestError('User not found');
    const updatedUser = await this.usersRepository.update({ id, role });
    return { user: updatedUser };
  }
}
