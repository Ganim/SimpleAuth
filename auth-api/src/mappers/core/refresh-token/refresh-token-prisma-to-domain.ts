import { RefreshToken } from '@/entities/core/refresh-token';
import { Token } from '@/entities/core/value-objects/token';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import type { Prisma } from '@prisma/client';

export function mapRefreshTokenPrismaToDomain(
  refreshTokenDb: Prisma.RefreshTokenGetPayload<object>,
): RefreshToken {
  return RefreshToken.create(
    {
      userId: new UniqueEntityID(refreshTokenDb.userId),
      sessionId: new UniqueEntityID(refreshTokenDb.sessionId),
      token: Token.create(refreshTokenDb.token, refreshTokenDb.expiresAt),
      expiresAt: refreshTokenDb.expiresAt,
      createdAt: refreshTokenDb.createdAt,
      revokedAt: refreshTokenDb.revokedAt ?? undefined,
    },
    new UniqueEntityID(refreshTokenDb.id),
  );
}
