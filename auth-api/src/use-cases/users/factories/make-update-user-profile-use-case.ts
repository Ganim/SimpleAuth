import { PrismaProfilesRepository } from '@/repositories/prisma/prisma-profiles-repository';
import { UpdateUserProfileUseCase } from '../update-user-profile';

export function makeUpdateUserProfileUseCase() {
  const profilesRepository = new PrismaProfilesRepository();
  return new UpdateUserProfileUseCase(profilesRepository);
}
