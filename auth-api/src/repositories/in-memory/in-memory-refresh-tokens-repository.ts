import { RefreshToken } from '@/entities/core/refresh-token';
import { Token } from '@/entities/core/value-objects/token';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import type {
  CreateRefreshTokenSchema,
  RefreshTokensRepository,
} from '../refresh-tokens-repository';

export class InMemoryRefreshTokensRepository
  implements RefreshTokensRepository
{
  // IN MEMORY DATABASE
  private items: RefreshToken[] = [];

  // CREATE
  // - create(data: CreateRefreshTokenSchema): Promise<RefreshToken;>

  async create(data: CreateRefreshTokenSchema): Promise<RefreshToken> {
    const refreshToken = RefreshToken.create({
      userId: data.userId,
      sessionId: data.sessionId,
      token: data.token,
      expiresAt: data.expiresAt,
      createdAt: new Date(),
    });

    this.items.push(refreshToken);

    return refreshToken;
  }

  // DELETE
  // - revokeBySessionId(sessionId: UniqueEntityID): Promise<void>;

  async revokeBySessionId(sessionId: UniqueEntityID): Promise<void> {
    for (const refreshToken of this.items) {
      if (refreshToken.sessionId.equals(sessionId)) {
        refreshToken.revokedAt = new Date();
      }
    }
  }

  // RETRIEVE
  // - findByToken(token: Token): Promise<RefreshToken | null>;
  // - listBySession(sessionId: UniqueEntityID): Promise<RefreshToken[]>;

  async findByToken(token: Token): Promise<RefreshToken | null> {
    return (
      this.items.find(
        (refreshToken: RefreshToken) =>
          refreshToken.token.value === token.value,
      ) ?? null
    );
  }

  async listBySession(sessionId: UniqueEntityID): Promise<RefreshToken[]> {
    return this.items.filter((refreshToken: RefreshToken) =>
      refreshToken.sessionId.equals(sessionId),
    );
  }
}
