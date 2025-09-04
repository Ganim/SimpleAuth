import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { Email } from '@/entities/core/value-objects/email';
import { UserDTO, userToDTO } from '@/mappers/core/user/user-to-dto';
import type { UsersRepository } from '@/repositories/core/users-repository';

interface GetUserByEmailUseCaseRequest {
  email: string;
}

interface GetUserByEmailUseCaseResponse {
  user: UserDTO;
}

export class GetUserByEmailUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
  }: GetUserByEmailUseCaseRequest): Promise<GetUserByEmailUseCaseResponse> {
    const validEmail = Email.create(email);

    const existingUser = await this.usersRepository.findByEmail(validEmail);

    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found.');
    }

    const user = userToDTO(existingUser);
    return { user };
  }
}
