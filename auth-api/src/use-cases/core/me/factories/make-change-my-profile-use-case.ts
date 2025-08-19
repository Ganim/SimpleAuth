import { PrismaProfilesRepository } from '@/repositories/prisma/prisma-profiles-repository';
import { ChangeMyProfileUseCase } from '../change-my-profile';

export function makeChangeMyProfileUseCase() {
  const profilesRepository = new PrismaProfilesRepository();
  return new ChangeMyProfileUseCase(profilesRepository);
}
