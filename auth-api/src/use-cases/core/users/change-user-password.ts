import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { Password } from '@/entities/core/value-objects/password';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
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
    const uniqueId = new UniqueEntityID(userId);
    const passwordHash = await Password.hash(password);

    const existingUser = await this.usersRepository.findById(uniqueId);
    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found.');
    }

    const updatedUser = await this.usersRepository.update({
      id: uniqueId,
      passwordHash,
    });

    const user = userToDTO(updatedUser);

    return { user };
  }
}
