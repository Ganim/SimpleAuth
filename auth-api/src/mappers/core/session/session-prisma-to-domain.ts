import { Session } from '@/entities/core/session';
import { IpAddress } from '@/entities/core/value-objects/ip-address';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import type { Prisma } from 'generated/prisma';

export function mapSessionPrismaToDomain(
  sessionDb: Prisma.SessionGetPayload<object>,
): Session {
  return Session.create(
    {
      userId: new UniqueEntityID(sessionDb.userId),
      ip: IpAddress.create(sessionDb.ip),
      createdAt: sessionDb.createdAt,
      expiredAt: sessionDb.expiredAt ?? undefined,
      revokedAt: sessionDb.revokedAt ?? undefined,
      lastUsedAt: sessionDb.lastUsedAt ?? undefined,
    },
    new UniqueEntityID(sessionDb.id),
  );
}
