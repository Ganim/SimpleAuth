import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UserRole } from '@/@types/user-role';
import { UserDTO, userToDTO } from '@/mappers/user/user-to-dto';
import { UsersRepository } from '@/repositories/users-repository';

interface ListAllUserByRoleUseCaseRequest {
  role: UserRole;
}

interface ListAllUserByRoleUseCaseResponse {
  users: UserDTO[];
}

export class ListAllUserByRoleUseCase {
  constructor(private userRespository: UsersRepository) {}

  async execute({
    role,
  }: ListAllUserByRoleUseCaseRequest): Promise<ListAllUserByRoleUseCaseResponse> {
    const allowedRoles: UserRole[] = ['USER', 'MANAGER', 'ADMIN'];

    if (!role || !allowedRoles.includes(role)) {
      throw new BadRequestError('Invalid or missing role parameter.');
    }

    const existingUsers = await this.userRespository.listAllByRole(role);
    if (!existingUsers || existingUsers.length === 0) {
      throw new ResourceNotFoundError('No users found.');
    }

    const users = existingUsers
      .filter((user) => !user.deletedAt)
      .map((user) => userToDTO(user));

    return { users };
  }
}
