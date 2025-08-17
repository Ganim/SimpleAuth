import type { UsersRepository } from '@/repositories/users-repository';
import type { User } from 'generated/prisma';
import { BadRequestError } from '../@errors/bad-request-error';

interface ChangeMyEmailUseCaseRequest {
  userId: string;
  email: string;
}

interface ChangeMyEmailUseCaseResponse {
  user: User;
}

export class ChangeMyEmailUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    email,
  }: ChangeMyEmailUseCaseRequest): Promise<ChangeMyEmailUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new BadRequestError('User not found');

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
