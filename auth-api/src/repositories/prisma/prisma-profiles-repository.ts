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
        ...(name && { name }),
        ...(surname && { surname }),
        ...(birthday && { birthday }),
        ...(location && { location }),
        ...(bio && { bio }),
        ...(avatarUrl && { avatarUrl }),
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
