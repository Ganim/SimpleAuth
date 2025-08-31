import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import type { UserRole } from '@/@types/user-role';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { UserDTO, userToDTO } from '@/mappers/core/user/user-to-dto';
import { UsersRepository } from '@/repositories/core/users-repository';

interface ChangeUserRoleUseCaseRequest {
  userId: string;
  role: UserRole;
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
    const validId = new UniqueEntityID(userId);

    const existingUser = await this.usersRepository.findById(validId);
    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found.');
    }

    const updatedUser = await this.usersRepository.update({
      id: validId,
      role,
    });

    if (!updatedUser) {
      throw new BadRequestError('Unable to update user role.');
    }

    const user = userToDTO(updatedUser);
    return { user };
  }
}
