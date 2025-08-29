import type { RefreshToken } from '@/entities/core/refresh-token';
import { Token } from '@/entities/core/value-objects/token';

export interface CreateRefreshTokenSchema {
  userId: string;
  sessionId: string;
  token: Token;
  expiresAt: Date;
}

export interface RefreshTokensRepository {
  // CREATE
  create(data: CreateRefreshTokenSchema): Promise<RefreshToken>;

  // UPDATE / PATCH
  revokeBySessionId(sessionId: string): Promise<void>;

  // RETRIEVE
  findByToken(token: Token): Promise<RefreshToken | null>;
  listBySession(sessionId: string): Promise<RefreshToken[]>;
}
