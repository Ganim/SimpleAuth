import type { UsersRepository } from '@/repositories/users-repository';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found';
import type { UserProfile } from 'generated/prisma/client';

interface listAllUserUseCaseResponse {
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

export class ListAllUserUseCase {
  constructor(
    private userRespository: UsersRepository,
    private profilesRepository: {
      findByUserId(userId: string): Promise<UserProfile | null>;
    },
  ) {}

  async execute(): Promise<listAllUserUseCaseResponse> {
    const users = await this.userRespository.listAll();
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
