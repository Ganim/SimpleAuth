import type { ProfilesRepository } from '@/repositories/profiles-repository';
import type { UserProfile } from 'generated/prisma';
import { BadRequestError } from '../@errors/bad-request-error';

interface UpdateMyProfileUseCaseRequest {
  userId: string;
  name?: string;
  surname?: string;
  birthday?: Date;
  location?: string;
  bio?: string;
  avatarUrl?: string;
}

interface UpdateMyProfileUseCaseResponse {
  profile: UserProfile;
}

export class UpdateMyProfileUseCase {
  constructor(private profilesRepository: ProfilesRepository) {}

  async execute({
    userId,
    name,
    surname,
    birthday,
    location,
    bio,
    avatarUrl,
  }: UpdateMyProfileUseCaseRequest): Promise<UpdateMyProfileUseCaseResponse> {
    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) throw new BadRequestError('Profile not found');
    const updatedProfile = await this.profilesRepository.update({
      user: { connect: { id: userId } },
      name,
      surname,
      birthday,
      location,
      bio,
      avatarUrl,
    });
    return { profile: updatedProfile };
  }
}
