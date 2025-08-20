import type { UserRole } from '@/@types/user-role';
import type { UsersRepository } from '@/repositories/users-repository';
import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found';
import type { UserProfile } from 'generated/prisma/client';

interface ListAllUserByRoleUseCaseRequest {
  role: UserRole;
}

interface ListAllUserByRoleUseCaseResponse {
  users: Array<{
    id: string;
    email: string;
    username: string;
    role: string;
    lastLoginAt: Date;
    profile: {
      name: string;
      surname: string;
      birthday: Date;
      location: string;
      bio: string;
      avatarUrl: string;
    };
  }>;
}

export class ListAllUserByRoleUseCase {
  constructor(
    private userRespository: UsersRepository,
    private profilesRepository: {
      findByUserId(userId: string): Promise<UserProfile | null>;
    },
  ) {}

  async execute({
    role,
  }: ListAllUserByRoleUseCaseRequest): Promise<ListAllUserByRoleUseCaseResponse> {
    const allowedRoles: UserRole[] = ['USER', 'MANAGER', 'ADMIN'];

    if (!role || !allowedRoles.includes(role)) {
      throw new BadRequestError('Invalid or missing role parameter');
    }

    const users = await this.userRespository.listAllByRole(role);
    if (!users || users.length === 0) {
      throw new ResourceNotFoundError('No users found');
    }
    const filteredUsers = await Promise.all(
      users
        .filter((user) => !user.deletedAt)
        .map(async (user) => {
          const profile = await this.profilesRepository.findByUserId(user.id);

          const safeProfile = profile
            ? {
                name: profile.name ?? '',
                surname: profile.surname ?? '',
                birthday: profile.birthday ?? new Date(0),
                location: profile.location ?? '',
                bio: profile.bio ?? '',
                avatarUrl: profile.avatarUrl ?? '',
              }
            : {
                name: '',
                surname: '',
                birthday: new Date(0),
                location: '',
                bio: '',
                avatarUrl: '',
              };

          return {
            id: user.id,
            username: user.username ?? '',
            email: user.email,
            role: String(user.role),
            lastLoginAt: user.lastLoginAt ?? new Date(0),
            profile: safeProfile,
          };
        }),
    );
    return { users: filteredUsers };
  }
}
