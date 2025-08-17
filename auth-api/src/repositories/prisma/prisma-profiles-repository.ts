import { prisma } from '@/lib/prisma';
import type { Prisma } from 'generated/prisma/client';
import type { ProfilesRepository } from '../profiles-repository';

export class PrismaProfilesRepository implements ProfilesRepository {
  // FORMS
  async create(data: Prisma.UserProfileCreateInput) {
    const profile = await prisma.userProfile.create({
      data,
    });
    return profile;
  }

  async update({
    userId,
    name,
    surname,
    birthday,
    location,
    bio,
    avatarUrl,
  }: {
    userId: string;
    name?: string;
    surname?: string;
    birthday?: Date;
    location?: string;
    bio?: string;
    avatarUrl?: string;
  }) {
    const profile = await prisma.userProfile.update({
      where: { userId },
      data: {
        ...(name !== undefined && { name }),
        ...(surname !== undefined && { surname }),
        ...(birthday !== undefined && { birthday }),
        ...(location !== undefined && { location }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
    });
    return profile;
  }

  // FIND
  async findById(id: string) {
    const profile = await prisma.userProfile.findUnique({
      where: { id },
    });
    return profile;
  }

  async findByUserId(userId: string) {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });
    return profile;
  }
}
