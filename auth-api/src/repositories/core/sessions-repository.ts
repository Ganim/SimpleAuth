import type { Session } from '@/entities/core/session';
import { IpAddress } from '@/entities/core/value-objects/ip-address';
import type { UniqueEntityID } from '@/entities/domain/unique-entity-id';

export interface CreateSessionSchema {
  userId: UniqueEntityID;
  ip: IpAddress;
}

export interface UpdateSessionInfoSchema {
  sessionId: UniqueEntityID;
  ip: IpAddress;
}

export interface SessionsRepository {
  // CREATE
  create(data: CreateSessionSchema): Promise<Session>;

  // UPDATE / PATCH
  updateSessionInfo(data: UpdateSessionInfoSchema): Promise<void>;

  // DELETE
  revoke(sessionId: UniqueEntityID): Promise<void>;
  expire(sessionId: UniqueEntityID): Promise<void>;

  // RETRIEVE
  listAllActive(): Promise<Session[]>;
  listByUser(userId: UniqueEntityID): Promise<Session[]>;
  listByUserAndDate(
    userId: UniqueEntityID,
    from: Date,
    to: Date,
  ): Promise<Session[]>;
}
