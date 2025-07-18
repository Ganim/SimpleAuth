import type { UsersRepository } from '@/repositories/users-repository';
import type { User } from 'generated/prisma';
import { BadRequestError } from '../@errors/bad-request-error';

interface GetUserUseCaseRequest {
  id: string;
}

export class GetUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: GetUserUseCaseRequest): Promise<{ user: User }> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new BadRequestError('User not found');
    return { user };
  }
}
