import type { UsersRepository } from '@/repositories/users-repository';
import type { User } from 'generated/prisma';
import { BadRequestError } from '../@errors/bad-request-error';

interface listAllUserUseCaseResponse {
  users: User[];
}

export class ListAllUserUseCase {
  constructor(private userRespository: UsersRepository) {}

  async execute(): Promise<listAllUserUseCaseResponse> {
    const users = await this.userRespository.listAll();

    if (!users) {
      throw new BadRequestError('No users found');
    }

    return { users };
  }
}
