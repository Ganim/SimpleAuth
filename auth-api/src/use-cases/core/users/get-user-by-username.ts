import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { Username } from '@/entities/core/value-objects/username';
import { UserDTO, userToDTO } from '@/mappers/core/user/user-to-dto';
import type { UsersRepository } from '@/repositories/core/users-repository';

interface GetUserByUsernameUseCaseRequest {
  username: string;
}

interface GetUserByUsernameUseCaseResponse {
  user: UserDTO;
}

export class GetUserByUsernameUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    username,
  }: GetUserByUsernameUseCaseRequest): Promise<GetUserByUsernameUseCaseResponse> {
    const validUsername = Username.create(username);

    const existingUser =
      await this.usersRepository.findByUsername(validUsername);

    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found.');
    }

    const user = userToDTO(existingUser);
    return { user };
  }
}
