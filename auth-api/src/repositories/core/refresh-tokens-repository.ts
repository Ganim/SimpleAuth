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
  revokeById(id: UniqueEntityID): Promise<void | null>;
  revokeBySessionId(sessionId: UniqueEntityID): Promise<void | null>;

  // RETRIEVE
  findByToken(token: Token): Promise<RefreshToken | null>;
  findBySessionId(sessionId: UniqueEntityID): Promise<RefreshToken | null>;

  // LIST
  listBySession(sessionId: UniqueEntityID): Promise<RefreshToken[] | null>;
}
