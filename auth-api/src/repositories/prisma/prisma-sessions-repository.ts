import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { Session } from '@/entities/core/session';
import type { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { prisma } from '@/lib/prisma';
import { mapSessionPrismaToDomain } from '@/mappers/session/session-prisma-to-domain';
import {
  CreateSessionSchema,
  SessionsRepository,
  UpdateSessionInfoSchema,
} from '../sessions-repository';

export class PrismaSessionsRepository implements SessionsRepository {
  // CREATE
  // - create(data: CreateSessionSchema): Promise<Session>;

  async create(data: CreateSessionSchema): Promise<Session> {
    const sessionDb = await prisma.session.create({
      data: {
        userId: data.userId.toString(),
        ip: data.ip.value,
        createdAt: new Date(),
      },
    });
    return mapSessionPrismaToDomain(sessionDb);
  }

  // UPDATE / PATCH
  //  - updateSessionInfo(data: UpdateSessionInfoSchema): Promise<void>;

  async updateSessionInfo(data: UpdateSessionInfoSchema): Promise<void> {
    const session = await prisma.session.findUnique({
      where: { id: data.sessionId.toString() },
    });
    if (!session) throw new ResourceNotFoundError('Session not found');

    await prisma.session.update({
      where: { id: data.sessionId.toString() },
      data: {
        ip: data.ip.value,
        lastUsedAt: new Date(),
      },
    });
  }

  // DELETE
  //  - revoke(sessionId: UniqueEntityID): Promise<void>;
  //  - expire(sessionId: UniqueEntityID): Promise<void>;

  async revoke(sessionId: UniqueEntityID): Promise<void> {
    await prisma.session.update({
      where: { id: sessionId.toString() },
      data: { revokedAt: new Date() },
    });
  }

  async expire(sessionId: UniqueEntityID): Promise<void> {
    await prisma.session.update({
      where: { id: sessionId.toString() },
      data: { expiredAt: new Date() },
    });
  }

  // RETRIEVE
  // - listAllActive(): Promise<Session[]>;
  // - listByUser(userId: UniqueEntityID): Promise<Session[]>;
  // - listByUserAndDate(userId: UniqueEntityID, from: Date, to: Date): Promise<Session[]>;

  async listAllActive(): Promise<Session[]> {
    const sessionsDb = await prisma.session.findMany({
      where: {
        expiredAt: null,
        revokedAt: null,
      },
    });
    return sessionsDb.map(mapSessionPrismaToDomain);
  }

  async listByUser(userId: UniqueEntityID): Promise<Session[]> {
    const sessionsDb = await prisma.session.findMany({
      where: { id: userId.toString() },
    });
    return sessionsDb.map(mapSessionPrismaToDomain);
  }

  async listByUserAndDate(
    userId: UniqueEntityID,
    from: Date,
    to: Date,
  ): Promise<Session[]> {
    const sessionsDb = await prisma.session.findMany({
      where: {
        id: userId.toString(),
        createdAt: {
          gte: from,
          lte: to,
        },
      },
    });
    return sessionsDb.map(mapSessionPrismaToDomain);
  }
}
