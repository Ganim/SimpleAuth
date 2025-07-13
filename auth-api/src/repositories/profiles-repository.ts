import type { Profile } from 'generated/prisma/client';

export interface ProfilesRepository {
  create(userId: string): Promise<Profile>;
  findById(id: string): Promise<Profile | null>;
  findByUserId(id: string): Promise<Profile | null>;
}
