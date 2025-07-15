import type { ProfilesRepository } from '@/repositories/profiles-repository';
import type { Profile } from 'generated/prisma';

interface createProfileUseCaseRequest {
  userId: string;
  name?: string;
  surname?: string;
}

interface createProfileUseCaseResponse {
  profile: Profile;
}

export class CreateProfileUseCase {
  constructor(private profileRespository: ProfilesRepository) {}

  async execute({
    userId,
    name,
    surname,
  }: createProfileUseCaseRequest): Promise<createProfileUseCaseResponse> {
    const profile = await this.profileRespository.create(userId, name, surname);

    return { profile };
  }
}
