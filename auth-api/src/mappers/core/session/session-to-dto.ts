import type { Session } from '@/entities/core/session';

export interface SessionDTO {
  userId: string;
  ip: string;
  createdAt: Date;
  expiredAt?: Date;
  revokedAt?: Date;
  lastUsedAt?: Date;
}

export function sessionToDTO(session: Session): SessionDTO {
  return {
    userId: session.userId.toString(),
    ip: session.ip.toString(),
    createdAt: session.createdAt,
    expiredAt: session.expiredAt ?? undefined,
    revokedAt: session.revokedAt ?? undefined,
    lastUsedAt: session.lastUsedAt ?? undefined,
  };
}
