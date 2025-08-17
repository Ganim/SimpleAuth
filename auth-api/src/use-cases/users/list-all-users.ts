import type { UsersRepository } from '@/repositories/users-repository';
import type { UserProfile } from 'generated/prisma/client';
import { BadRequestError } from '../@errors/bad-request-error';

interface listAllUserUseCaseResponse {
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
      throw new BadRequestError('No users found');
    }
    const filteredUsers = await Promise.all(
      users
        .filter((user) => !user.deletedAt)
        .map(async (user) => {
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
