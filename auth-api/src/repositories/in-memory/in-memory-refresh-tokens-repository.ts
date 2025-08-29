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
  async create(data: CreateRefreshTokenSchema): Promise<RefreshToken> {
    const refreshToken = RefreshToken.create({
      userId: new UniqueEntityID(data.userId),
      sessionId: new UniqueEntityID(data.sessionId),
      token: data.token,
      expiresAt: data.expiresAt,
      createdAt: new Date(),
    });
    this.items.push(refreshToken);
    return refreshToken;
  }

  // UPDATE / PATCH
  async revokeBySessionId(sessionId: string): Promise<void> {
    for (const refreshToken of this.items) {
      if (refreshToken.sessionId.toString() === sessionId) {
        refreshToken.revokedAt = new Date();
      }
    }
  }

  // RETRIEVE
  async findByToken(token: Token): Promise<RefreshToken | null> {
    return (
      this.items.find(
        (refreshToken: RefreshToken) =>
          refreshToken.token.value === token.value,
      ) ?? null
    );
  }

  async listBySession(sessionId: string): Promise<RefreshToken[]> {
    return this.items.filter(
      (refreshToken: RefreshToken) =>
        refreshToken.sessionId.toString() === sessionId,
    );
  }
}
