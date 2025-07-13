import type { ProfilesRepository } from '@/repositories/profiles-repository';
import type { Profile } from 'generated/prisma';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

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
      throw new ResourceNotFoundError();
    }

    return { profile };
  }
}
