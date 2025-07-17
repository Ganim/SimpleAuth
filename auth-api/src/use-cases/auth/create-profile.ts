import type { ProfilesRepository } from '@/repositories/profiles-repository';
import type { Profile } from 'generated/prisma';

interface createProfileUseCaseRequest {
  userId: string;
  profile?: {
    name: string;
    surname: string;
  };
}

interface createProfileUseCaseResponse {
  createdProfile: Profile;
}

export class CreateProfileUseCase {
  constructor(private profileRespository: ProfilesRepository) {}

  async execute({
    userId,
    profile = { name: '', surname: '' },
  }: createProfileUseCaseRequest): Promise<createProfileUseCaseResponse> {
    const createdProfile = await this.profileRespository.create(
      userId,
      profile.name,
      profile.surname,
    );

    return { createdProfile };
  }
}
