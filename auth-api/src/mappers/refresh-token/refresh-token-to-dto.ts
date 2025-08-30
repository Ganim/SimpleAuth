import type { RefreshToken } from '@/entities/core/refresh-token';

export interface RefreshTokenDTO {
  userId: string;
  sessionId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt?: Date;
}

export function refreshTokenToDTO(refreshToken: RefreshToken): RefreshTokenDTO {
  return {
    userId: refreshToken.userId.toString(),
    sessionId: refreshToken.sessionId.toString(),
    token: refreshToken.token.toString(),
    expiresAt: refreshToken.expiresAt,
    createdAt: refreshToken.createdAt,
    revokedAt: refreshToken.revokedAt ?? undefined,
  };
}
