import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { Role } from '@/entities/core/value-objects/role';
import { UserDTO, userToDTO } from '@/mappers/core/user/user-to-dto';
import { UsersRepository } from '@/repositories/core/users-repository';
import type { Role as PrismaRole } from '@prisma/client';

interface ListAllUserByRoleUseCaseRequest {
  role: PrismaRole;
}

interface ListAllUserByRoleUseCaseResponse {
  users: UserDTO[];
}

export class ListAllUserByRoleUseCase {
  constructor(private userRespository: UsersRepository) {}

  async execute({
    role,
  }: ListAllUserByRoleUseCaseRequest): Promise<ListAllUserByRoleUseCaseResponse> {
    const validRole = Role.isValid(role);

    if (!role || !validRole) {
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
