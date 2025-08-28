import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UserDTO, userToDTO } from '@/mappers/user/user-to-dto';
import type { UsersRepository } from '@/repositories/users-repository';

interface GetMyUserUseCaseRequest {
  userId: string;
}

interface GetMyUserUseCaseResponse {
  user: UserDTO;
}

export class GetMyUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetMyUserUseCaseRequest): Promise<GetMyUserUseCaseResponse> {
    const existingUser = await this.usersRepository.findById(userId);
    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found.');
    }

    const user = userToDTO(existingUser);
    return { user };
  }
}
