import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UserDTO, userToDTO } from '@/mappers/core/user/user-to-dto';
import type { UsersRepository } from '@/repositories/core/users-repository';

interface ListAllUserUseCaseResponse {
  users: UserDTO[];
}

export class ListAllUserUseCase {
  constructor(private userRespository: UsersRepository) {}

  async execute(): Promise<ListAllUserUseCaseResponse> {
    const existingUsers = await this.userRespository.listAll();
    if (!existingUsers || existingUsers.length === 0) {
      throw new ResourceNotFoundError('No users found.');
    }

    const users = existingUsers
      .filter((user) => !user.deletedAt)
      .map((user) => userToDTO(user));

    return { users };
  }
}
