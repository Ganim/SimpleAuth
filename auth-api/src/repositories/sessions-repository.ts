import type { Session } from 'generated/prisma';

export interface SessionsRepository {
  listAllActive(): Promise<Session[]>;
  listByUser(userId: string): Promise<Session[]>;
  listByUserAndDate(userId: string, from: Date, to: Date): Promise<Session[]>;
  revoke(sessionId: string): Promise<void>;
  expire(sessionId: string): Promise<void>;
  create?(data: { userId: string; ip: string }): Promise<Session>;
  updateSessionInfo(sessionId: string, ip: string): Promise<void>;
}
