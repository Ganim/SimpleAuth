import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { Username } from '@/entities/core/value-objects/username';
import { UserDTO, userToDTO } from '@/mappers/user/user-to-dto';
import { UsersRepository } from '@/repositories/users-repository';
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
