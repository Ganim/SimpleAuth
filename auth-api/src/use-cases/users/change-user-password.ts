import type { UsersRepository } from '@/repositories/users-repository';
import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { hash } from 'bcryptjs';
import type { User } from 'generated/prisma';

interface ChangeUserPasswordUseCaseRequest {
  id: string;
  password: string;
}

interface ChangeUserPasswordUseCaseResponse {
  user: User;
}

export class ChangeUserPasswordUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    password,
  }: ChangeUserPasswordUseCaseRequest): Promise<ChangeUserPasswordUseCaseResponse> {
    const user = await this.usersRepository.findById(id);
    if (!user || user.deletedAt) throw new BadRequestError('User not found');
    const password_hash = await hash(password, 8);
    const updatedUser = await this.usersRepository.update({
      id,
      password_hash,
    });
    return { user: updatedUser };
  }
}
