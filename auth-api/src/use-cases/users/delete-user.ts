import type { UsersRepository } from '@/repositories/users-repository';
import { BadRequestError } from '../@errors/bad-request-error';

interface DeleteUserUseCaseRequest {
  id: string;
}

export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: DeleteUserUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new BadRequestError('User not found');
    await this.usersRepository.delete(id);
  }
}
