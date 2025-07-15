import { prisma } from '@/lib/prisma';
import type { ProfilesRepository } from '../profiles-repository';

export class PrismaProfilesRepository implements ProfilesRepository {
  async create(userId: string, name?: string, surname?: string) {
    const profile = await prisma.profile.create({
      data: {
        userId,
        name,
        surname,
      },
    });
    return profile;
  }
  async findById(id: string) {
    const profile = await prisma.profile.findUnique({
      where: { id },
    });
    return profile;
  }

  async findByUserId(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });
    return profile;
  }
}
