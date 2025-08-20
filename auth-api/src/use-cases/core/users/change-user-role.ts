import type { UsersRepository } from '@/repositories/users-repository';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found';
import type { User } from 'generated/prisma';

interface ChangeUserRoleUseCaseRequest {
  userId: string;
  role: 'USER' | 'MANAGER' | 'ADMIN';
}

interface ChangeUserRoleUseCaseResponse {
  user: User;
}

export class ChangeUserRoleUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    role,
  }: ChangeUserRoleUseCaseRequest): Promise<ChangeUserRoleUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user || user.deletedAt)
      throw new ResourceNotFoundError('User not found');
    const updatedUser = await this.usersRepository.update({ id: userId, role });
    return { user: updatedUser };
  }
}
