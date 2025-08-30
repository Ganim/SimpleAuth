import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { Username } from '@/entities/core/value-objects/username';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { UserDTO, userToDTO } from '@/mappers/core/user/user-to-dto';
import { UsersRepository } from '@/repositories/core/users-repository';
import { BadRequestError } from '../../../@errors/use-cases/bad-request-error';

interface ChangeUserUsernameUseCaseRequest {
  userId: string;
  username: string;
}

interface ChangeUserUsernameUseCaseResponse {
  user: UserDTO;
}

export class ChangeUserUsernameUseCase {
  private usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute({
    userId,
    username,
  }: ChangeUserUsernameUseCaseRequest): Promise<ChangeUserUsernameUseCaseResponse> {
    const validId = new UniqueEntityID(userId);
    const validUsername = Username.create(username);

    const existingUser = await this.usersRepository.findById(validId);
    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found');
    }

    const userWithSameUsername =
      await this.usersRepository.findByUsername(validUsername);

    if (userWithSameUsername && !userWithSameUsername.id.equals(validId)) {
      throw new BadRequestError('Username already in use');
    }

    const updatedUser = await this.usersRepository.update({
      id: validId,
      username: validUsername,
    });

    if (!updatedUser) {
      throw new BadRequestError('Unable to update user username.');
    }

    const user = userToDTO(updatedUser);
    return { user };
  }
}
