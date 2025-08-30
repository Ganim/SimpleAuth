import { RefreshToken } from '@/entities/core/refresh-token';
import { Token } from '@/entities/core/value-objects/token';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { prisma } from '@/lib/prisma';
import { mapRefreshTokenPrismaToDomain } from '@/mappers/core/refresh-token/refresh-token-prisma-to-domain';
import {
  CreateRefreshTokenSchema,
  RefreshTokensRepository,
} from '../refresh-tokens-repository';

export class PrismaRefreshTokensRepository implements RefreshTokensRepository {
  // CREATE
  // - create(data: CreateRefreshTokenSchema): Promise<RefreshToken;>

  async create(data: CreateRefreshTokenSchema): Promise<RefreshToken> {
    const refreshTokenDb = await prisma.refreshToken.create({
      data: {
        userId: data.userId.toString(),
        sessionId: data.sessionId.toString(),
        token: data.token.value,
        expiresAt: data.expiresAt,
      },
    });

    return mapRefreshTokenPrismaToDomain(refreshTokenDb);
  }

  // DELETE
  // - revokeBySessionId(sessionId: UniqueEntityID): Promise<void | null>;

  async revokeBySessionId(sessionId: UniqueEntityID): Promise<void | null> {
    const result = await prisma.refreshToken.updateMany({
      where: { sessionId: sessionId.toString() },
      data: { revokedAt: new Date() },
    });
    if (result.count === 0) return null;
  }

  // RETRIEVE
  // - findByToken(token: Token): Promise<RefreshToken | null>;
  // - findBySessionId(sessionId: UniqueEntityID): Promise<RefreshToken | null>;

  async findByToken(token: Token) {
    const refreshTokenDb = await prisma.refreshToken.findUnique({
      where: { token: token.value },
    });

    if (!refreshTokenDb) return null;

    return mapRefreshTokenPrismaToDomain(refreshTokenDb);
  }

  async findBySessionId(sessionId: UniqueEntityID) {
    const refreshTokenDb = await prisma.refreshToken.findFirst({
      where: { sessionId: sessionId.toString() },
    });

    if (!refreshTokenDb) return null;

    return mapRefreshTokenPrismaToDomain(refreshTokenDb);
  }

  // LIST
  // - listBySession(sessionId: UniqueEntityID): Promise<RefreshToken[] | null>;

  async listBySession(
    sessionId: UniqueEntityID,
  ): Promise<RefreshToken[] | null> {
    const refreshTokensDb = await prisma.refreshToken.findMany({
      where: { sessionId: sessionId.toString() },
    });
    if (!refreshTokensDb || refreshTokensDb.length === 0) return null;
    return refreshTokensDb.map(mapRefreshTokenPrismaToDomain);
  }
}
