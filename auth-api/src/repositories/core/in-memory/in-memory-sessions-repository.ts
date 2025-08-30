import { Session } from '@/entities/core/session';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import {
  type CreateSessionSchema,
  type UpdateSessionSchema,
  SessionsRepository,
} from '../sessions-repository';

export class InMemorySessionsRepository implements SessionsRepository {
  // IN MEMORY DATABASE
  private items: Session[] = [];

  // CREATE
  // - create(data: CreateSessionSchema): Promise<Session>;

  async create(data: CreateSessionSchema) {
    const session = Session.create({
      userId: data.userId,
      ip: data.ip,
      createdAt: new Date(),
    });

    this.items.push(session);

    return session;
  }

  // UPDATE / PATCH
  //  - update(data: UpdateSessionSchema): Promise<Session | null>;

  async update(data: UpdateSessionSchema): Promise<Session | null> {
    const session = this.items.find((item) => item.id.equals(data.sessionId));

    if (!session) return null;

    session.lastUsedAt = new Date();

    if (session.ip.value !== data.ip.value) {
      session.ip = data.ip;
    }

    return session;
  }

  // DELETE
  //  - revoke(sessionId: UniqueEntityID): Promise<void | null>;
  //  - expire(sessionId: UniqueEntityID): Promise<void | null>;

  async revoke(sessionId: UniqueEntityID): Promise<void | null> {
    const session = this.items.find((item) => item.id.equals(sessionId));

    if (!session) return null;

    session.revokedAt = new Date();
  }

  async expire(sessionId: UniqueEntityID): Promise<void | null> {
    const session = this.items.find((item) => item.id.equals(sessionId));

    if (!session) return null;

    session.expiredAt = new Date();
  }

  // RETRIEVE
  // - findById(sessionId: UniqueEntityID): Promise<Session | null>;

  async findById(sessionId: UniqueEntityID): Promise<Session | null> {
    return this.items.find((item) => item.id.equals(sessionId)) || null;
  }

  // LIST
  // - listAllActive(): Promise<Session[] | null>;
  // - listByUser(userId: UniqueEntityID): Promise<Session[] | null>;
  // - listByUserAndDate(userId: UniqueEntityID, from: Date, to: Date): Promise<Session[] | null>;

  async listAllActive(): Promise<Session[] | null> {
    const sessionList = this.items.filter(
      (item) => !item.expiredAt && !item.revokedAt,
    );
    if (sessionList.length === 0) return null;
    return sessionList;
  }

  async listByUser(userId: UniqueEntityID): Promise<Session[] | null> {
    const sessionList = this.items.filter((item) => item.userId.equals(userId));

    if (sessionList.length === 0) return null;

    return sessionList;
  }

  async listByUserAndDate(
    userId: UniqueEntityID,
    from: Date,
    to: Date,
  ): Promise<Session[] | null> {
    const sessionList = this.items.filter(
      (item) =>
        item.userId.equals(userId) &&
        item.createdAt >= from &&
        item.createdAt <= to,
    );

    if (sessionList.length === 0) return null;

    return sessionList;
  }
}
