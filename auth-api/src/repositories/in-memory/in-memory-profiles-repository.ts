import type { Profile } from 'generated/prisma/client';
import type { ProfilesRepository } from '../profiles-repository';

export class InMemoryProfilesRepository implements ProfilesRepository {
  private items: Profile[] = [];

  async create(userId: string) {
    const profile = {
      id: String(this.items.length + 1),
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Profile;

    this.items.push(profile);
    return profile;
  }

  async findById(id: string) {
    const profile = this.items.find((item) => item.id === id);

    if (!profile) {
      return null;
    }

    return profile;
  }

  async findByUserId(userId: string) {
    const profile = this.items.find((item) => item.userId === userId);

    if (!profile) {
      return null;
    }

    return profile;
  }
}
