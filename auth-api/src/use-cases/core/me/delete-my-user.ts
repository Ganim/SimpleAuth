import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import type { UsersRepository } from '@/repositories/core/users-repository';

interface DeleteMyUserUseCaseRequest {
  userId: string;
}

export class DeleteMyUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: DeleteMyUserUseCaseRequest): Promise<void> {
    const validId = new UniqueEntityID(userId);

    const existingUser = await this.usersRepository.findById(validId);
    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found');
    }

    await this.usersRepository.delete(validId); // Soft delete: marca deletedAt
  }
}
