import { IpAddress } from '@/entities/core/value-objects/ip-address';

import { Session } from '@/entities/core/session';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import {
  CreateSessionSchema,
  SessionsRepository,
} from '../sessions-repository';

export class InMemorySessionsRepository implements SessionsRepository {
  // IN MEMORY DATABASE
  private items: Session[] = [];

  // CREATE
  async create(data: CreateSessionSchema): Promise<Session> {
    const session = Session.create({
      userId: new UniqueEntityID(data.userId),
      ip: data.ip,
      createdAt: new Date(),
    });
    this.items.push(session);
    return session;
  }

  // UPDATE / PATCH
  async updateSessionInfo({
    sessionId,
    ip,
  }: {
    sessionId: string;
    ip: IpAddress;
  }): Promise<void> {
    const session = this.items.find((s) => s.id.toString() === sessionId);
    if (!session) throw new Error('Session not found');
    session.lastUsedAt = new Date();
    if (session.ip.value !== ip.value) {
      session.ip = ip;
    }
  }

  async revoke(sessionId: string): Promise<void> {
    const session = this.items.find((s) => s.id.toString() === sessionId);
    if (!session) throw new Error('Session not found');
    session.revokedAt = new Date();
  }

  async expire(sessionId: string): Promise<void> {
    const session = this.items.find((s) => s.id.toString() === sessionId);
    if (!session) throw new Error('Session not found');
    session.expiredAt = new Date();
  }

  // RETRIEVE
  async listAllActive(): Promise<Session[]> {
    return this.items.filter((s) => !s.expiredAt && !s.revokedAt);
  }

  async listByUser(userId: string): Promise<Session[]> {
    return this.items.filter((s) => s.userId.toString() === userId);
  }

  async listByUserAndDate(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<Session[]> {
    return this.items.filter(
      (s) =>
        s.userId.toString() === userId &&
        s.createdAt >= from &&
        s.createdAt <= to,
    );
  }

  // LIST
  async listAll(): Promise<Session[]> {
    return [...this.items];
  }
}
