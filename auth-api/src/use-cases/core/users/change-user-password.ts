import type { UsersRepository } from '@/repositories/users-repository';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found';
import { hash } from 'bcryptjs';
import type { User } from 'generated/prisma';

interface ChangeUserPasswordUseCaseRequest {
  userId: string;
  password: string;
}

interface ChangeUserPasswordUseCaseResponse {
  user: User;
}

export class ChangeUserPasswordUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    password,
  }: ChangeUserPasswordUseCaseRequest): Promise<ChangeUserPasswordUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user || user.deletedAt)
      throw new ResourceNotFoundError('User not found');
    const password_hash = await hash(password, 8);
    const updatedUser = await this.usersRepository.update({
      id: userId,
      password_hash,
    });
    return { user: updatedUser };
  }
}
