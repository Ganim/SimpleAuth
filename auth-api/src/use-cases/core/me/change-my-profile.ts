import type { ProfilesRepository } from '@/repositories/profiles-repository';
import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import type { UserProfile } from 'generated/prisma';

interface ChangeMyProfileUseCaseRequest {
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

interface ChangeMyProfileUseCaseResponse {
  profile: UserProfile;
}

export class ChangeMyProfileUseCase {
  constructor(private profilesRepository: ProfilesRepository) {}

  async execute({
    userId,
    profile,
  }: ChangeMyProfileUseCaseRequest): Promise<ChangeMyProfileUseCaseResponse> {
    const existingProfile = await this.profilesRepository.findByUserId(userId);
    if (!existingProfile) throw new BadRequestError('Profile not found');

    const updatedProfile = await this.profilesRepository.update({
      userId,
      ...profile,
    });

    return { profile: updatedProfile };
  }
}
