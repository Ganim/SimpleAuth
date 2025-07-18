import { PrismaProfilesRepository } from '@/repositories/prisma/prisma-profiles-repository';
import { EditProfileUseCase } from '../edit-profile';

export function makeEditProfileUseCase() {
  const profilesRepository = new PrismaProfilesRepository();
  return new EditProfileUseCase(profilesRepository);
}
