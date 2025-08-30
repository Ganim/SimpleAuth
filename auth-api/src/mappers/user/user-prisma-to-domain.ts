import { Email } from '@/entities/core/value-objects/email';
import { Token } from '@/entities/core/value-objects/token';
import { Username } from '@/entities/core/value-objects/username';
import { Prisma } from 'generated/prisma';
import { mapUserProfilePrismaToDomain } from './user-profile-prisma-to-domain';

export function mapUserPrismaToDomain(
  userDb: Prisma.UserGetPayload<{ include: { profile: true } }>,
) {
  return {
    username: Username.create(userDb.username ?? ''),
    email: new Email(userDb.email),
    password: userDb.password_hash,
    role: userDb.role,
    failedLoginAttempts: userDb.failedLoginAttempts,
    blockedUntil: userDb.blockedUntil ?? undefined,
    deletedAt: userDb.deletedAt ?? undefined,
    passwordResetToken: userDb.passwordResetToken
      ? new Token(userDb.passwordResetToken)
      : undefined,
    passwordResetExpires: userDb.passwordResetExpires ?? undefined,
    lastLoginAt: userDb.lastLoginAt ?? undefined,
    createdAt: userDb.createdAt,
    updatedAt: userDb.updatedAt,
    profile: userDb.profile
      ? mapUserProfilePrismaToDomain(userDb.profile)
      : null,
  };
}
