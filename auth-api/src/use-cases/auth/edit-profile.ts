import type { ProfilesRepository } from '@/repositories/profiles-repository';
import type { Profile } from 'generated/prisma';
import { BadRequestError } from '../@errors/bad-request-error';

interface EditProfileUseCaseRequest {
  userId: string;
  name?: string;
  surname?: string;
  bio?: string;
  avatarUrl?: string;
}

export class EditProfileUseCase {
  constructor(private profilesRepository: ProfilesRepository) {}

  async execute({
    userId,
    name,
    surname,
    bio,
    avatarUrl,
  }: EditProfileUseCaseRequest): Promise<{ profile: Profile }> {
    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) throw new BadRequestError('Profile not found');
    const updatedProfile = await this.profilesRepository.update({
      userId,
      name,
      surname,
      bio,
      avatarUrl,
    });
    return { profile: updatedProfile };
  }
}
