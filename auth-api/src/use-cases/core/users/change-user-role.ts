import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UserDTO, userToDTO } from '@/mappers/core/user/user-to-dto';
import { UsersRepository } from '@/repositories/core/users-repository';

interface ChangeUserRoleUseCaseRequest {
  userId: string;
  role: 'USER' | 'MANAGER' | 'ADMIN';
}

interface ChangeUserRoleUseCaseResponse {
  user: UserDTO;
}

export class ChangeUserRoleUseCase {
  private usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute({
    userId,
    role,
  }: ChangeUserRoleUseCaseRequest): Promise<ChangeUserRoleUseCaseResponse> {
    const existingUser = await this.usersRepository.findById(userId);
    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found.');
    }

    const updatedUser = await this.usersRepository.update({ id: userId, role });

    const user = userToDTO(updatedUser);
    return { user };
  }
}
