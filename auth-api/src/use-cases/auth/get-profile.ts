import type { ProfilesRepository } from '@/repositories/profiles-repository';
import type { Profile } from 'generated/prisma';
import { BadRequestError } from '../@errors/bad-request-error';

interface GetProfileUseCaseRequest {
  userId: string;
}

interface GetProfileUseCaseResponse {
  profile: Profile;
}

export class GetProfileUseCase {
  constructor(private profilesRepository: ProfilesRepository) {}

  async execute({
    userId,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const profile = await this.profilesRepository.findByUserId(userId);

    if (!profile) {
      throw new BadRequestError('Profile not found');
    }

    return { profile };
  }
}
