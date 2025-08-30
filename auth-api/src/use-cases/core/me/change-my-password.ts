import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { Password } from '@/entities/core/value-objects/password';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
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
    const validId = new UniqueEntityID(userId);
    const passwordHash = await Password.hash(password);

    const existingUser = await this.usersRepository.findById(validId);
    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found.');
    }

    const updatedUser = await this.usersRepository.update({
      id: validId,
      passwordHash,
    });

    if (!updatedUser) {
      throw new BadRequestError('Unable to update user password.');
    }

    const user = userToDTO(updatedUser);

    return { user };
  }
}
