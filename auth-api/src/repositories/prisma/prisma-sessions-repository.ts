import { prisma } from '@/lib/prisma';
import type { Session } from 'generated/prisma';

import { SessionsRepository } from '../sessions-repository';

export class PrismaSessionsRepository implements SessionsRepository {
  async updateSessionInfo(sessionId: string, ip: string): Promise<void> {
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        ip,
        lastUsedAt: new Date(),
      },
    });
  }
  async listAllActive(): Promise<Session[]> {
    return prisma.session.findMany({
      where: {
        expiredAt: null,
        revokedAt: null,
      },
    });
  }

  async listByUser(userId: string): Promise<Session[]> {
    return prisma.session.findMany({
      where: { userId },
    });
  }

  async listByUserAndDate(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<Session[]> {
    return prisma.session.findMany({
      where: {
        userId,
        createdAt: {
          gte: from,
          lte: to,
        },
      },
    });
  }

  async revoke(sessionId: string): Promise<void> {
    await prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }

  async expire(sessionId: string): Promise<void> {
    await prisma.session.update({
      where: { id: sessionId },
      data: { expiredAt: new Date() },
    });
  }

  async create({
    userId,
    ip,
  }: {
    userId: string;
    ip: string;
  }): Promise<Session> {
    return prisma.session.create({
      data: {
        userId,
        ip,
      },
    });
  }
}
