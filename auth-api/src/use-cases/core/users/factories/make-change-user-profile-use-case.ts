import { PrismaProfilesRepository } from '@/repositories/prisma/prisma-profiles-repository';
import { ChangeUserProfileUseCase } from '../change-user-profile';

export function makeChangeUserProfileUseCase() {
  const profilesRepository = new PrismaProfilesRepository();
  return new ChangeUserProfileUseCase(profilesRepository);
}
