import { PrismaProfilesRepository } from '@/repositories/prisma/prisma-profiles-repository';
import { DeleteProfileUseCase } from '../delete-profile';

export function makeDeleteProfileUseCase() {
  const profilesRepository = new PrismaProfilesRepository();
  return new DeleteProfileUseCase(profilesRepository);
}
