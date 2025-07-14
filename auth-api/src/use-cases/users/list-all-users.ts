import type { UsersRepository } from '@/repositories/users-repository';
import type { User } from 'generated/prisma';
import { ResourceNotFoundError } from '../@errors/resource-not-found-error';

interface listAllUserUseCaseResponse {
  users: User[];
}

export class ListAllUserUseCase {
  constructor(private userRespository: UsersRepository) {}

  async execute(): Promise<listAllUserUseCaseResponse> {
    const users = await this.userRespository.listAll();

    if (!users) {
      throw new ResourceNotFoundError();
    }

    return { users };
  }
}
