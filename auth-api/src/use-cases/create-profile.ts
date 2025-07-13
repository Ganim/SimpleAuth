import type { ProfilesRepository } from '@/repositories/profiles-repository';
import type { Profile } from 'generated/prisma';

interface createProfileUseCaseRequest {
  userId: string;
}

interface createProfileUseCaseResponse {
  profile: Profile;
}

export class CreateProfileUseCase {
  constructor(private profileRespository: ProfilesRepository) {}

  async execute({
    userId,
  }: createProfileUseCaseRequest): Promise<createProfileUseCaseResponse> {
    const profile = await this.profileRespository.create(userId);

    return { profile };
  }
}
