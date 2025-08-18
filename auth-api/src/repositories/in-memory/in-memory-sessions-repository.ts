import type { Session } from 'generated/prisma';

import { SessionsRepository } from '../sessions-repository';

export class InMemorySessionsRepository implements SessionsRepository {
  async updateSessionInfo(sessionId: string, ip: string): Promise<void> {
    const session = this.items.find((s) => s.id === sessionId);
    if (!session) return;
    session.lastUsedAt = new Date();
    if (session.ip !== ip) {
      session.ip = ip;
    }
  }
  public items: Session[] = [];

  async listAllActive(): Promise<Session[]> {
    return this.items.filter((s) => !s.expiredAt && !s.revokedAt);
  }

  async listByUser(userId: string): Promise<Session[]> {
    return this.items.filter((s) => s.userId === userId);
  }

  async listByUserAndDate(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<Session[]> {
    return this.items.filter(
      (s) => s.userId === userId && s.createdAt >= from && s.createdAt <= to,
    );
  }

  async revoke(sessionId: string): Promise<void> {
    const session = this.items.find((s) => s.id === sessionId);
    if (session) session.revokedAt = new Date();
  }

  async expire(sessionId: string): Promise<void> {
    const session = this.items.find((s) => s.id === sessionId);
    if (session) session.expiredAt = new Date();
  }

  async create({
    userId,
    ip,
  }: {
    userId: string;
    ip: string;
  }): Promise<Session> {
    const session: Session = {
      id: Math.random().toString(36).slice(2),
      userId,
      ip,
      createdAt: new Date(),
      expiredAt: null,
      revokedAt: null,
      lastUsedAt: null,
    };
    this.items.push(session);
    return session;
  }
}
