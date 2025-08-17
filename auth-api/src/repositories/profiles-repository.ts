import type { Prisma, UserProfile } from 'generated/prisma/client';

export interface ProfilesRepository {
  create(data: Prisma.UserProfileCreateInput): Promise<UserProfile>;
  findById(id: string): Promise<UserProfile | null>;
  findByUserId(id: string): Promise<UserProfile | null>;
  update(data: {
    userId: string;
    name?: string;
    surname?: string;
    birthday?: Date;
    location?: string;
    bio?: string;
    avatarUrl?: string;
  }): Promise<UserProfile>;
}
