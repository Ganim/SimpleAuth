import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { Password } from '@/entities/core/value-objects/password';
import { UserDTO, userToDTO } from '@/mappers/core/user/user-to-dto';
import { UsersRepository } from '@/repositories/core/users-repository';

interface ChangeUserPasswordUseCaseRequest {
  userId: string;
  password: string;
}

interface ChangeUserPasswordUseCaseResponse {
  user: UserDTO;
}

export class ChangeUserPasswordUseCase {
  private usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute({
    userId,
    password,
  }: ChangeUserPasswordUseCaseRequest): Promise<ChangeUserPasswordUseCaseResponse> {
    const existingUser = await this.usersRepository.findById(userId);
    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found.');
    }

    const passwordHash = await Password.hash(password);

    const updatedUser = await this.usersRepository.update({
      id: userId,
      passwordHash,
    });

    const user = userToDTO(updatedUser);
    return { user };
  }
}
