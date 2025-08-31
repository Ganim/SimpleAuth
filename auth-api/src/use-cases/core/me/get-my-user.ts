import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { UserDTO, userToDTO } from '@/mappers/core/user/user-to-dto';
import type { UsersRepository } from '@/repositories/core/users-repository';

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
    const validId = new UniqueEntityID(userId);

    const existingUser = await this.usersRepository.findById(validId);

    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found.');
    }

    const user = userToDTO(existingUser);
    return { user };
  }
}
