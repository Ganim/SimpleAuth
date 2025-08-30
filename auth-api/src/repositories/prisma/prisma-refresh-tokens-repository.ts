import { RefreshToken } from '@/entities/core/refresh-token';
import { Token } from '@/entities/core/value-objects/token';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { prisma } from '@/lib/prisma';
import { mapRefreshTokenPrismaToDomain } from '@/mappers/refresh-token/refresh-token-prisma-to-domain';
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
  // - revokeBySessionId(sessionId: UniqueEntityID): Promise<void>;

  async revokeBySessionId(sessionId: UniqueEntityID): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { sessionId: sessionId.toString() },
      data: { revokedAt: new Date() },
    });
  }

  // RETRIEVE
  // - findByToken(token: Token): Promise<RefreshToken | null>;
  // - listBySession(sessionId: UniqueEntityID): Promise<RefreshToken[]>;

  async findByToken(token: Token): Promise<RefreshToken | null> {
    const refreshTokenDb = await prisma.refreshToken.findUnique({
      where: { token: token.value },
    });
    if (!refreshTokenDb) return null;
    return mapRefreshTokenPrismaToDomain(refreshTokenDb);
  }

  async listBySession(sessionId: UniqueEntityID): Promise<RefreshToken[]> {
    const refreshTokensDb = await prisma.refreshToken.findMany({
      where: { sessionId: sessionId.toString() },
    });
    return refreshTokensDb.map(mapRefreshTokenPrismaToDomain);
  }
}
