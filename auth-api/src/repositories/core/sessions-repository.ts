import type { Session } from '@/entities/core/session';
import { IpAddress } from '@/entities/core/value-objects/ip-address';
import type { UniqueEntityID } from '@/entities/domain/unique-entity-id';

export interface CreateSessionSchema {
  userId: UniqueEntityID;
  ip: IpAddress;
}

export interface UpdateSessionSchema {
  sessionId: UniqueEntityID;
  ip: IpAddress;
}

export interface SessionsRepository {
  // CREATE
  create(data: CreateSessionSchema): Promise<Session>;

  // UPDATE / PATCH
  update(data: UpdateSessionSchema): Promise<Session | null>;

  // DELETE
  revoke(sessionId: UniqueEntityID): Promise<void | null>;
  expire(sessionId: UniqueEntityID): Promise<void | null>;

  // RETRIEVE
  findById(sessionId: UniqueEntityID): Promise<Session | null>;

  //LIST
  listAllActive(): Promise<Session[] | null>;
  listByUser(userId: UniqueEntityID): Promise<Session[] | null>;
  listByUserAndDate(
    userId: UniqueEntityID,
    from: Date,
    to: Date,
  ): Promise<Session[] | null>;
}
