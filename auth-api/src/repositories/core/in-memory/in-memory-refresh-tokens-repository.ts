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
  // - revokeById(id: UniqueEntityID): Promise<void | null>;
  // - revokeBySessionId(sessionId: UniqueEntityID): Promise<void | null>;

  async revokeById(id: UniqueEntityID): Promise<void | null> {
    const token = this.items.find((item) => item.id.equals(id));
    if (!token) return null;

    token.revokedAt = new Date();
  }

  async revokeBySessionId(sessionId: UniqueEntityID): Promise<void | null> {
    const tokensToRevoke = this.items.filter((item) =>
      item.sessionId.equals(sessionId),
    );

    tokensToRevoke.forEach((item) => {
      item.revokedAt = new Date();
    });

    if (tokensToRevoke.length === 0) return null;
  }

  // RETRIEVE
  // - findByToken(token: Token): Promise<RefreshToken | null>;
  // - findBySessionId(sessionId: UniqueEntityID): Promise<RefreshToken | null>;

  async findByToken(token: Token): Promise<RefreshToken | null> {
    const refreshToken = this.items.find(
      (item) => item.token.value === token.value,
    );

    if (!refreshToken) return null;

    return refreshToken;
  }

  async findBySessionId(
    sessionId: UniqueEntityID,
  ): Promise<RefreshToken | null> {
    const refreshToken = this.items.find((item) =>
      item.sessionId.equals(sessionId),
    );

    if (!refreshToken) return null;

    return refreshToken;
  }

  // LIST
  // - listBySession(sessionId: UniqueEntityID): Promise<RefreshToken[] | null>;
  async listBySession(
    sessionId: UniqueEntityID,
  ): Promise<RefreshToken[] | null> {
    const refreshTokenList = this.items.filter((item) =>
      item.sessionId.equals(sessionId),
    );

    if (!refreshTokenList || refreshTokenList.length === 0) return null;

    return refreshTokenList;
  }
}
