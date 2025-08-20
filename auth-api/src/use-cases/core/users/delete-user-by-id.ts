import type { UsersRepository } from '@/repositories/users-repository';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found';

interface DeleteUserByIdUseCaseRequest {
  userId: string;
}

export class DeleteUserByIdUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: DeleteUserByIdUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new ResourceNotFoundError('User not found');
    // Soft delete: marca deletedAt
    await this.usersRepository.delete(userId);
  }
}
