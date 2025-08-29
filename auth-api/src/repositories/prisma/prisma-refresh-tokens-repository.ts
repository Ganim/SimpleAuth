import type { RefreshToken } from '@/entities/core/refresh-token';
import { Token } from '@/entities/core/value-objects/token';
import { prisma } from '@/lib/prisma';
import { mapRefreshTokenPrismaToDomain } from '@/mappers/refresh-token/refresh-token-prisma-to-domain';
import type {
  CreateRefreshTokenSchema,
  RefreshTokensRepository,
} from '../refresh-tokens-repository';

export class PrismaRefreshTokensRepository implements RefreshTokensRepository {
  // CREATE
  async create(data: CreateRefreshTokenSchema): Promise<RefreshToken> {
    const refreshTokenDb = await prisma.refreshToken.create({
      data: {
        userId: data.userId,
        sessionId: data.sessionId,
        token: data.token.value,
        expiresAt: data.expiresAt,
      },
    });
    return mapRefreshTokenPrismaToDomain(refreshTokenDb);
  }

  // UPDATE / PATCH
  async revokeBySessionId(sessionId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { sessionId },
      data: { revokedAt: new Date() },
    });
  }

  // RETRIEVE
  async findByToken(token: Token): Promise<RefreshToken | null> {
    const refreshTokenDb = await prisma.refreshToken.findUnique({
      where: { token: token.value },
    });
    if (!refreshTokenDb) return null;
    return mapRefreshTokenPrismaToDomain(refreshTokenDb);
  }

  async listBySession(sessionId: string): Promise<RefreshToken[]> {
    const refreshTokensDb = await prisma.refreshToken.findMany({
      where: { sessionId },
    });
    return refreshTokensDb.map(mapRefreshTokenPrismaToDomain);
  }
}
