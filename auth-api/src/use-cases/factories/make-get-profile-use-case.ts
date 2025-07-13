import { PrismaProfilesRepository } from '@/repositories/prisma/prisma-profiles-repository';
import { GetProfileUseCase } from '../get-profile';

export function makeGetUserProfileUseCase() {
  const profileRepository = new PrismaProfilesRepository();
  const getUserProfileUseCase = new GetProfileUseCase(profileRepository);

  return getUserProfileUseCase;
}
