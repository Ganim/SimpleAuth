import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import type { UsersRepository } from '@/repositories/core/users-repository';

interface DeleteUserByIdUseCaseRequest {
  userId: string;
}

export class DeleteUserByIdUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: DeleteUserByIdUseCaseRequest): Promise<void> {
    const existingUser = await this.usersRepository.findById(userId);
    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found');
    }
    // Soft delete: marca deletedAt
    await this.usersRepository.delete(userId);
  }
}
