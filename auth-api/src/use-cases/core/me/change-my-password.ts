import type { UsersRepository } from '@/repositories/users-repository';
import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { hash } from 'bcryptjs';
import type { User } from 'generated/prisma';

interface ChangeMyPasswordUseCaseRequest {
  userId: string;
  password: string;
}

interface ChangeMyPasswordUseCaseResponse {
  user: User;
}

export class ChangeMyPasswordUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    password,
  }: ChangeMyPasswordUseCaseRequest): Promise<ChangeMyPasswordUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new BadRequestError('User not found');
    const password_hash = await hash(password, 8);
    const updatedUser = await this.usersRepository.update({
      id: userId,
      password_hash,
    });
    return { user: updatedUser };
  }
}
