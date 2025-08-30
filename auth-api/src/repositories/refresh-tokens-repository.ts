import type { RefreshToken } from '@/entities/core/refresh-token';
import { Token } from '@/entities/core/value-objects/token';
import type { UniqueEntityID } from '@/entities/domain/unique-entity-id';

export interface CreateRefreshTokenSchema {
  userId: UniqueEntityID;
  sessionId: UniqueEntityID;
  token: Token;
  expiresAt: Date;
}

export interface RefreshTokensRepository {
  // CREATE
  create(data: CreateRefreshTokenSchema): Promise<RefreshToken>;

  // DELETE
  revokeBySessionId(sessionId: UniqueEntityID): Promise<void>;

  // RETRIEVE
  findByToken(token: Token): Promise<RefreshToken | null>;
  listBySession(sessionId: UniqueEntityID): Promise<RefreshToken[]>;
}
