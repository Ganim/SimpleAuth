import { prisma } from '@/lib/prisma';
import { RefreshTokensRepository } from '../refresh-tokens-repository';

export class PrismaRefreshTokensRepository implements RefreshTokensRepository {
  async revokeBySessionId(sessionId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { sessionId },
      data: { revokedAt: new Date() },
    });
  }
}
