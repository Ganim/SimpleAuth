import type { Prisma, UserProfile } from 'generated/prisma/client';

export interface ProfilesRepository {
  create(data: Prisma.UserProfileCreateInput): Promise<UserProfile>;
  findById(id: string): Promise<UserProfile | null>;
  findByUserId(id: string): Promise<UserProfile | null>;
  update(data: Prisma.UserProfileUpdateInput): Promise<UserProfile>;
}
