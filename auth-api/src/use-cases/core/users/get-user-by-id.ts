import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UserDTO, userToDTO } from '@/mappers/core/user/user-to-dto';
import type { UsersRepository } from '@/repositories/core/users-repository';

interface GetUserByIdUseCaseRequest {
  userId: string;
}

interface GetUserByIdUseCaseResponse {
  user: UserDTO;
}

export class GetUserByIdUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserByIdUseCaseRequest): Promise<GetUserByIdUseCaseResponse> {
    const existingUser = await this.usersRepository.findById(userId);
    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found.');
    }

    const user = userToDTO(existingUser);
    return { user };
  }
}
