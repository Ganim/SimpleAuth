import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { Username } from '@/entities/core/value-objects/username';
import { UserDTO, userToDTO } from '@/mappers/user/user-to-dto';
import { UsersRepository } from '@/repositories/users-repository';

interface ChangeMyUsernameUseCaseRequest {
  userId: string;
  username: string;
}

interface ChangeMyUsernameUseCaseResponse {
  user: UserDTO;
}

export class ChangeMyUsernameUseCase {
  private usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute({
    userId,
    username,
  }: ChangeMyUsernameUseCaseRequest): Promise<ChangeMyUsernameUseCaseResponse> {
    const existingUser = await this.usersRepository.findById(userId);
    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found');
    }

    // Validação de unicidade do username
    const existing = await this.usersRepository.findByUsername(username);
    if (existing && existing.id.toString() !== userId) {
      throw new BadRequestError('Username already in use');
    }

    const updatedUser = await this.usersRepository.update({
      id: userId,
      username: Username.create(username),
    });

    const user = userToDTO(updatedUser);
    return { user };
  }
}
