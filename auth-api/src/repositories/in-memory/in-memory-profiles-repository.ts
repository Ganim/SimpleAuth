import type { Prisma, UserProfile } from 'generated/prisma/client';
import type { ProfilesRepository } from '../profiles-repository';

export class InMemoryProfilesRepository implements ProfilesRepository {
  private items: UserProfile[] = [];

  // FORMS
  async create(data: Prisma.UserProfileCreateInput) {
    const profile = {
      id: String(this.items.length + 1),
      userId: data.user.connect?.id,
      name: data.name ?? null,
      surname: data.surname ?? null,
      birthday: data.birthday ?? null,
      location: data.location ?? null,
      bio: data.bio ?? null,
      avatarUrl: data.avatarUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserProfile;

    this.items.push(profile);
    return profile;
  }

  async update(data: {
    userId?: string;
    user?: { connect: { id: string } };
    name?: string;
    surname?: string;
    birthday?: Date;
    location?: string;
    bio?: string;
    avatarUrl?: string;
  }): Promise<UserProfile> {
    // Aceita tanto userId quanto user.connect.id
    const id = data.userId ?? data.user?.connect?.id;
    const profile = this.items.find((item) => item.userId === id);

    if (!profile) {
      throw new Error('Profile not found.');
    }

    profile.name = data.name ?? '';
    profile.surname = data.surname ?? '';
    profile.birthday = data.birthday ?? null;
    profile.location = data.location ?? '';
    profile.bio = data.bio ?? '';
    profile.avatarUrl = data.avatarUrl ?? '';

    profile.updatedAt = new Date();

    return profile;
  }

  // FIND
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
