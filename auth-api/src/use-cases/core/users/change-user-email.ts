import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UserDTO, userToDTO } from '@/mappers/user/user-to-dto';
import { UsersRepository } from '@/repositories/users-repository';
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
    const existingUser = await this.usersRepository.findById(userId);
    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found.');
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail && userWithSameEmail.id.toString() !== userId) {
      throw new BadRequestError('This email is already in use.');
    }

    const updatedUser = await this.usersRepository.update({
      id: userId,
      email,
    });

    const user = userToDTO(updatedUser);
    return { user };
  }
}
