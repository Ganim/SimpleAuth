import type { ProfilesRepository } from '@/repositories/profiles-repository';
import type { UsersRepository } from '@/repositories/users-repository';
import type { UserProfile } from 'generated/prisma/client';
import { ResourceNotFoundError } from '../../@errors/resource-not-found';

interface GetUserByIdUseCaseRequest {
  userId: string;
}

interface GetUserByIdUseCaseResponse {
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
    lastLoginAt: Date;
  };
  profile: UserProfile;
}

export class GetUserByIdUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private profilesRepository: ProfilesRepository,
  ) {}

  async execute({
    userId,
  }: GetUserByIdUseCaseRequest): Promise<GetUserByIdUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user || user.deletedAt)
      throw new ResourceNotFoundError('User not found');

    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) throw new ResourceNotFoundError('Profile not found');

    const formatedUser = {
      id: user.id,
      email: user.email,
      username: user.username ?? '', // Garantir que seja string
      role: String(user.role), // Garantir que seja string
      lastLoginAt: user.lastLoginAt ?? new Date(0), // Garantir que seja Date
    };
    return { user: formatedUser, profile };
  }
}
