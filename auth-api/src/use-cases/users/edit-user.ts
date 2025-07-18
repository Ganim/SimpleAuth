import type { UsersRepository } from '@/repositories/users-repository';
import type { User } from 'generated/prisma';
import { BadRequestError } from '../@errors/bad-request-error';

interface EditUserUseCaseRequest {
  id: string;
  email?: string;
  role?: 'USER' | 'MANAGER' | 'ADMIN';
}

export class EditUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    email,
    role,
  }: EditUserUseCaseRequest): Promise<{ user: User }> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new BadRequestError('User not found');
    const updatedUser = await this.usersRepository.update({ id, email, role });
    return { user: updatedUser };
  }
}
