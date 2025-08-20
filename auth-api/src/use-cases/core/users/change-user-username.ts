import type { UsersRepository } from '@/repositories/users-repository';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found';
import type { User } from 'generated/prisma';
import { BadRequestError } from '../../@errors/bad-request-error';

interface ChangeUserUsernameUseCaseRequest {
  userId: string;
  username: string;
}

interface ChangeUserUsernameUseCaseResponse {
  user: User;
}

export class ChangeUserUsernameUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    username,
  }: ChangeUserUsernameUseCaseRequest): Promise<ChangeUserUsernameUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user || user.deletedAt)
      throw new ResourceNotFoundError('User not found');

    // Validação de unicidade do username
    const existing = await this.usersRepository.findByUsername(username);
    if (existing && existing.id !== userId) {
      throw new BadRequestError('Username already in use');
    }

    const updatedUser = await this.usersRepository.update({
      id: userId,
      username,
    });
    return { user: updatedUser };
  }
}
