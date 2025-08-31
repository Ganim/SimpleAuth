import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import type { UsersRepository } from '@/repositories/core/users-repository';

interface DeleteUserByIdUseCaseRequest {
  userId: string;
}

export class DeleteUserByIdUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: DeleteUserByIdUseCaseRequest): Promise<void> {
    const validId = new UniqueEntityID(userId);

    const existingUser = await this.usersRepository.findById(validId);
    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found');
    }

    await this.usersRepository.delete(validId); // Soft delete: marca deletedAt
  }
}
