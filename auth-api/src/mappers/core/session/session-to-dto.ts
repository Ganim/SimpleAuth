import type { Session } from '@/entities/core/session';

export interface SessionDTO {
  id: string;
  userId: string;
  ip: string;
  createdAt: Date;
  expiredAt?: Date | null;
  revokedAt?: Date | null;
  lastUsedAt?: Date | null;
}

export function sessionToDTO(session: Session): SessionDTO {
  return {
    id: session.id.toString(),
    userId: session.userId.toString(),
    ip: session.ip.toString(),
    createdAt: session.createdAt,
    expiredAt: session.expiredAt ?? null,
    revokedAt: session.revokedAt ?? null,
    lastUsedAt: session.lastUsedAt ?? null,
  };
}
