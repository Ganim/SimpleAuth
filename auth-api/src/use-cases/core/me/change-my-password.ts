import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { Password } from '@/entities/core/value-objects/password';
import { UserDTO, userToDTO } from '@/mappers/core/user/user-to-dto';
import { UsersRepository } from '@/repositories/core/users-repository';

interface ChangeMyPasswordUseCaseRequest {
  userId: string;
  password: string;
}

interface ChangeMyPasswordUseCaseResponse {
  user: UserDTO;
}

export class ChangeMyPasswordUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    password,
  }: ChangeMyPasswordUseCaseRequest): Promise<ChangeMyPasswordUseCaseResponse> {
    const existingUser = await this.usersRepository.findById(userId);
    if (!existingUser || existingUser.deletedAt)
      throw new ResourceNotFoundError('User not found.');

    const passwordHash = await Password.hash(password);

    const updatedUser = await this.usersRepository.update({
      id: userId,
      passwordHash,
    });

    const user = userToDTO(updatedUser);

    return { user };
  }
}
