import { UserProfile } from '@/entities/core/user-profile';
import { Email } from '@/entities/core/value-objects/email';
import { Username } from '@/entities/core/value-objects/username';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import type { Prisma } from 'generated/prisma';

export function mapUserPrismaToDomain(
  userDb: Prisma.UserGetPayload<{ include: { profile: true } }>,
) {
  return {
    username: Username.create(userDb.username ?? ''),
    email: new Email(userDb.email),
    passwordHash: userDb.password_hash,
    role: userDb.role,
    failedLoginAttempts: userDb.failedLoginAttempts,
    blockedUntil: userDb.blockedUntil ?? undefined,
    deletedAt: userDb.deletedAt ?? undefined,
    passwordResetToken: userDb.passwordResetToken ?? undefined,
    passwordResetExpires: userDb.passwordResetExpires ?? undefined,
    lastLoginAt: userDb.lastLoginAt ?? undefined,
    createdAt: userDb.createdAt,
    updatedAt: userDb.updatedAt,
    profile: userDb.profile
      ? UserProfile.create({
          userId: new UniqueEntityID(userDb.profile.userId ?? userDb.id),
          name: userDb.profile.name ?? '',
          surname: userDb.profile.surname ?? '',
          birthday: userDb.profile.birthday ?? undefined,
          location: userDb.profile.location ?? '',
          bio: userDb.profile.bio ?? '',
          avatarUrl: userDb.profile.avatarUrl ?? '',
          createdAt: userDb.profile.createdAt ?? new Date(),
          updatedAt: userDb.profile.updatedAt ?? new Date(),
        })
      : null,
  };
}
