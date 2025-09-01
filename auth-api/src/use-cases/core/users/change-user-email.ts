import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { Email } from '@/entities/core/value-objects/email';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { UserDTO, userToDTO } from '@/mappers/core/user/user-to-dto';
import { UsersRepository } from '@/repositories/core/users-repository';
import { BadRequestError } from '../../../@errors/use-cases/bad-request-error';

interface ChangeUserEmailUseCaseRequest {
  userId: string;
  email: string;
}
interface ChangeUserEmailUseCaseResponse {
  user: UserDTO;
}

export class ChangeUserEmailUseCase {
  private usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute({
    userId,
    email,
  }: ChangeUserEmailUseCaseRequest): Promise<ChangeUserEmailUseCaseResponse> {
    const validId = new UniqueEntityID(userId);
    const validEmail = Email.create(email);

    const existingUser = await this.usersRepository.findById(validId);

    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found.');
    }

    const userWithSameEmail =
      await this.usersRepository.findByEmail(validEmail);

    if (userWithSameEmail && !userWithSameEmail.id.equals(validId)) {
      throw new BadRequestError('This email is already in use.');
    }

    const updatedUser = await this.usersRepository.update({
      id: validId,
      email: validEmail,
    });

    if (!updatedUser) {
      throw new BadRequestError('Unable to update user email.');
    }

    const user = userToDTO(updatedUser);
    return { user };
  }
}
