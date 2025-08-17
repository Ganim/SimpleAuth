import type { UsersRepository } from '@/repositories/users-repository';
import type { User } from 'generated/prisma';
import { BadRequestError } from '../@errors/bad-request-error';

interface ChangeUserEmailUseCaseRequest {
  id: string;
  email: string;
}

interface ChangeUserEmailUseCaseResponse {
  user: User;
}

export class ChangeUserEmailUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    email,
  }: ChangeUserEmailUseCaseRequest): Promise<ChangeUserEmailUseCaseResponse> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new BadRequestError('User not found');

    // Validação de unicidade do email
    const existing = await this.usersRepository.findByEmail(email);
    if (existing && existing.id !== id) {
      throw new BadRequestError('Email já está em uso');
    }

    const updatedUser = await this.usersRepository.update({ id, email });
    return { user: updatedUser };
  }
}
