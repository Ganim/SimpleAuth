import type { UsersRepository } from '@/repositories/users-repository';
import type { User } from 'generated/prisma';
import { BadRequestError } from '../@errors/bad-request-error';

interface listAllUserUseCaseResponse {
  users: Array<Pick<User, 'id' | 'email' | 'role'>>;
}

export class ListAllUserUseCase {
  constructor(private userRespository: UsersRepository) {}

  async execute(): Promise<listAllUserUseCaseResponse> {
    const users = await this.userRespository.listAll();

    if (!users) {
      throw new BadRequestError('No users found');
    }

    const filteredUsers = users.map(({ id, email, role }) => ({
      id,
      email,
      role,
    }));

    return { users: filteredUsers };
  }
}
