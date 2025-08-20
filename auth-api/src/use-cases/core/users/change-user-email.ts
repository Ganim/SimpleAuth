import type { UsersRepository } from '@/repositories/users-repository';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found';
import type { User } from 'generated/prisma';
import { BadRequestError } from '../../@errors/bad-request-error';

interface ChangeUserEmailUseCaseRequest {
  userId: string;
  email: string;
}

interface ChangeUserEmailUseCaseResponse {
  user: User;
}

export class ChangeUserEmailUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    email,
  }: ChangeUserEmailUseCaseRequest): Promise<ChangeUserEmailUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user || user.deletedAt)
      throw new ResourceNotFoundError('User not found');

    // Validação de unicidade do email
    const existing = await this.usersRepository.findByEmail(email);
    if (existing && existing.id !== userId) {
      throw new BadRequestError('Email já está em uso');
    }

    const updatedUser = await this.usersRepository.update({
      id: userId,
      email,
    });
    return { user: updatedUser };
  }
}
