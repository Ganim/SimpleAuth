import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
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
    const uniqueId = new UniqueEntityID(userId);

    const existingUser = await this.usersRepository.findById(uniqueId);
    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found.');
    }

    const updatedUser = await this.usersRepository.update({
      id: uniqueId,
      role,
    });

    const user = userToDTO(updatedUser);
    return { user };
  }
}
