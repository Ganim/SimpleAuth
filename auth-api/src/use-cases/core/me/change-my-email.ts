import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { Email } from '@/entities/core/value-objects/email';
import { UserDTO, userToDTO } from '@/mappers/core/user/user-to-dto';
import { UsersRepository } from '@/repositories/core/users-repository';

interface ChangeMyEmailUseCaseRequest {
  userId: string;
  email: string;
}

interface ChangeMyEmailUseCaseResponse {
  user: UserDTO;
}

export class ChangeMyEmailUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    email,
  }: ChangeMyEmailUseCaseRequest): Promise<ChangeMyEmailUseCaseResponse> {
    const existingUser = await this.usersRepository.findById(userId);
    if (!existingUser || existingUser.deletedAt)
      throw new ResourceNotFoundError('User not found.');

    const validEmail = new Email(email);

    const userWithSameEmail =
      await this.usersRepository.findByEmail(validEmail);
    if (userWithSameEmail && userWithSameEmail.id.toString() !== userId) {
      throw new BadRequestError('This email is already in use.');
    }

    const updatedUser = await this.usersRepository.update({
      id: userId,
      email: validEmail,
    });

    const user = userToDTO(updatedUser);

    return { user };
  }
}
