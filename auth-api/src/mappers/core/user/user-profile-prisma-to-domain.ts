import { UserProfile } from '@/entities/core/user-profile';
import { Url } from '@/entities/core/value-objects/url';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { Prisma } from 'generated/prisma';

export function mapUserProfilePrismaToDomain(
  userProfileDB: Prisma.UserProfileGetPayload<object>,
) {
  return UserProfile.create({
    userId: new UniqueEntityID(userProfileDB.userId ?? userProfileDB.id),
    name: userProfileDB.name ?? '',
    surname: userProfileDB.surname ?? '',
    birthday: userProfileDB.birthday ?? undefined,
    location: userProfileDB.location ?? '',
    bio: userProfileDB.bio ?? '',
    avatarUrl: new Url(userProfileDB.avatarUrl ?? ''),
    createdAt: userProfileDB.createdAt ?? new Date(),
    updatedAt: userProfileDB.updatedAt ?? undefined,
  });
}
