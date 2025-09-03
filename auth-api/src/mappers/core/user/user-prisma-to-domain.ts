import { Email } from '@/entities/core/value-objects/email';
import { Password } from '@/entities/core/value-objects/password';
import { Role } from '@/entities/core/value-objects/role';
import { Token } from '@/entities/core/value-objects/token';
import { Username } from '@/entities/core/value-objects/username';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { Role as PrismaRole, type Prisma } from '@prisma/client';
import { mapUserProfilePrismaToDomain } from './user-profile-prisma-to-domain';

// Use the enum directly instead of Prisma.Role
const VALID_ROLES: PrismaRole[] = Object.values(PrismaRole);

export function mapUserPrismaToDomain(
  userDb: Prisma.UserGetPayload<{ include: { profile: true } }>,
) {
  const roleValue =
    userDb.role && VALID_ROLES.includes(userDb.role) ? userDb.role : 'USER';

  return {
    id: new UniqueEntityID(userDb.id),
    username: Username.create(userDb.username ?? ''),
    email: Email.create(userDb.email),
    password: Password.fromHash(userDb.password_hash),
    role: Role.create(roleValue),
    failedLoginAttempts: userDb.failedLoginAttempts,
    blockedUntil: userDb.blockedUntil ?? undefined,
    deletedAt: userDb.deletedAt ?? undefined,
    passwordResetToken: userDb.passwordResetToken
      ? Token.create(userDb.passwordResetToken)
      : undefined,
    passwordResetExpires: userDb.passwordResetExpires ?? undefined,
    lastLoginAt: userDb.lastLoginAt ?? undefined,
    createdAt: userDb.createdAt,
    updatedAt: userDb.updatedAt,
    profile: userDb.profile
      ? mapUserProfilePrismaToDomain(userDb.profile, userDb.id)
      : null,
  };
}
