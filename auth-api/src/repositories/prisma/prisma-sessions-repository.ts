import type { Session } from '@/entities/core/session';
import { IpAddress } from '@/entities/core/value-objects/ip-address';
import { prisma } from '@/lib/prisma';
import { mapSessionPrismaToDomain } from '@/mappers/session/session-prisma-to-domain';
import type {
  CreateSessionSchema,
  SessionsRepository,
} from '../sessions-repository';

export class PrismaSessionsRepository implements SessionsRepository {
  // CREATE
  async create(data: CreateSessionSchema): Promise<Session> {
    const sessionDb = await prisma.session.create({
      data: {
        userId: data.userId,
        ip: data.ip.value,
        createdAt: new Date(),
      },
    });
    return mapSessionPrismaToDomain(sessionDb);
  }

  // UPDATE / PATCH
  async updateSessionInfo({
    sessionId,
    ip,
  }: {
    sessionId: string;
    ip: IpAddress;
  }): Promise<void> {
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        ip: ip.value,
        lastUsedAt: new Date(),
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

  // RETRIEVE
  async listAllActive(): Promise<Session[]> {
    const sessionsDb = await prisma.session.findMany({
      where: {
        expiredAt: null,
        revokedAt: null,
      },
    });
    return sessionsDb.map(mapSessionPrismaToDomain);
  }

  async listByUser(userId: string): Promise<Session[]> {
    const sessionsDb = await prisma.session.findMany({
      where: { userId },
    });
    return sessionsDb.map(mapSessionPrismaToDomain);
  }

  async listByUserAndDate(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<Session[]> {
    const sessionsDb = await prisma.session.findMany({
      where: {
        userId,
        createdAt: {
          gte: from,
          lte: to,
        },
      },
    });
    return sessionsDb.map(mapSessionPrismaToDomain);
  }

  // LIST
  async listAll(): Promise<Session[]> {
    const sessionsDb = await prisma.session.findMany();
    return sessionsDb.map(mapSessionPrismaToDomain);
  }
}
