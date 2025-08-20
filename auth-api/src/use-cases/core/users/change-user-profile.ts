import type { ProfilesRepository } from '@/repositories/profiles-repository';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found';
import type { UserProfile } from 'generated/prisma';

interface ChangeUserProfileUseCaseRequest {
  userId: string;
  profile: {
    name?: string;
    surname?: string;
    birthday?: Date;
    location?: string;
    bio?: string;
    avatarUrl?: string;
  };
}

interface ChangeUserProfileUseCaseResponse {
  profile: UserProfile;
}

export class ChangeUserProfileUseCase {
  constructor(private profilesRepository: ProfilesRepository) {}

  async execute({
    userId,
    profile,
  }: ChangeUserProfileUseCaseRequest): Promise<ChangeUserProfileUseCaseResponse> {
    const existingProfile = await this.profilesRepository.findByUserId(userId);

    if (!existingProfile) throw new ResourceNotFoundError('Profile not found');

    const updatedProfile = await this.profilesRepository.update({
      userId,
      ...profile,
    });
    return { profile: updatedProfile };
  }
}
