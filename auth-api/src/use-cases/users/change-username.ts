import type { UsersRepository } from '@/repositories/users-repository';
import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import type { User } from 'generated/prisma';

interface ChangeUsernameUseCaseRequest {
  id: string;
  username: string;
}

interface ChangeUsernameUseCaseResponse {
  user: User;
}

export class ChangeUsernameUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    username,
  }: ChangeUsernameUseCaseRequest): Promise<ChangeUsernameUseCaseResponse> {
    const user = await this.usersRepository.findById(id);
    if (!user || user.deletedAt) throw new BadRequestError('User not found');

    // Validação de unicidade do username
    const existing = await this.usersRepository.findByUsername(username);
    if (existing && existing.id !== id) {
      throw new BadRequestError('Username já está em uso');
    }

    const updatedUser = await this.usersRepository.update({ id, username });
    return { user: updatedUser };
  }
}
