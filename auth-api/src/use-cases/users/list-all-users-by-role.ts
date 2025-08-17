import type { UserRole } from '@/@types/user-role';
import type { UsersRepository } from '@/repositories/users-repository';
import type { UserProfile } from 'generated/prisma/client';
import { BadRequestError } from '../@errors/bad-request-error';

interface ListAllUserByRoleUseCaseRequest {
  role: UserRole;
}

interface ListAllUserByRoleUseCaseResponse {
  users: Array<{
    id: string;
    username: string;
    email: string;
    role: string;
    profile?: {
      name?: string | null;
      surname?: string | null;
      birthday?: Date | null;
      location?: string | null;
      avatarUrl?: string | null;
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
      throw new BadRequestError('No users found');
    }

    const filteredUsers = await Promise.all(
      users.map(async (user) => {
        const profile = await this.profilesRepository.findByUserId(user.id);

        const safeProfile = profile
          ? {
              name: profile.name ?? null,
              surname: profile.surname ?? null,
              birthday: profile.birthday ?? null,
              location: profile.location ?? null,
              avatarUrl: profile.avatarUrl ?? null,
            }
          : undefined;

        return {
          id: user.id,
          username: user.username ?? '',
          email: user.email,
          role: String(user.role),
          profile: safeProfile,
        };
      }),
    );
    return { users: filteredUsers };
  }
}
