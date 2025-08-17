import { PrismaProfilesRepository } from '@/repositories/prisma/prisma-profiles-repository';
import { UpdateMyProfileUseCase } from '../update-my-profile';

export function makeUpdateMyProfileUseCase() {
  const profilesRepository = new PrismaProfilesRepository();
  return new UpdateMyProfileUseCase(profilesRepository);
}
