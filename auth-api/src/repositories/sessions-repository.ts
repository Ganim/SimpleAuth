import type { Session } from '@/entities/core/session';
import { IpAddress } from '@/entities/core/value-objects/ip-address';

export interface CreateSessionSchema {
  userId: string;
  ip: IpAddress;
}

export interface UpdateSessionInfoSchema {
  sessionId: string;
  ip: IpAddress;
}

export interface SessionsRepository {
  // CREATE
  create(data: CreateSessionSchema): Promise<Session>;

  // UPDATE / PATCH
  updateSessionInfo(data: UpdateSessionInfoSchema): Promise<void>;
  revoke(sessionId: string): Promise<void>;
  expire(sessionId: string): Promise<void>;

  // RETRIEVE
  listAllActive(): Promise<Session[]>;
  listByUser(userId: string): Promise<Session[]>;
  listByUserAndDate(userId: string, from: Date, to: Date): Promise<Session[]>;
}
