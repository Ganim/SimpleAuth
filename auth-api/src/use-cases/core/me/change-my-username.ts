import type { UsersRepository } from '@/repositories/users-repository';
import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import type { User } from 'generated/prisma';

interface ChangeMyUsernameUseCaseRequest {
  userId: string;
  username: string;
}

interface ChangeMyUsernameUseCaseResponse {
  user: User;
}

export class ChangeMyUsernameUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    username,
  }: ChangeMyUsernameUseCaseRequest): Promise<ChangeMyUsernameUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new BadRequestError('User not found');

    // Validação de unicidade do username
    const existing = await this.usersRepository.findByUsername(username);
    if (existing && existing.id !== userId) {
      throw new BadRequestError('Username já está em uso');
    }

    const updatedUser = await this.usersRepository.update({
      id: userId,
      username,
    });
    return { user: updatedUser };
  }
}
