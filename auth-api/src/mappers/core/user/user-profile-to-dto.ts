import type { UserProfile } from '@/entities/core/user-profile';

export interface UserProfileDTO {
  id: string;
  userId: string;
  name: string;
  surname: string;
  birthday?: Date;
  location: string;
  bio: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt?: Date;
}

export function userProfileToDTO(profile: UserProfile): UserProfileDTO {
  return {
    id: profile.id.toString(),
    userId: profile.userId.toString(),
    name: profile.name,
    surname: profile.surname,
    birthday: profile.birthday ?? undefined,
    location: profile.location,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl.toString(),
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt ?? undefined,
  };
}
