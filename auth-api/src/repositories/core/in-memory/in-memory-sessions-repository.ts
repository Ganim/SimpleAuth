import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { Session } from '@/entities/core/session';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import {
  CreateSessionSchema,
  SessionsRepository,
  type UpdateSessionInfoSchema,
} from '../sessions-repository';

export class InMemorySessionsRepository implements SessionsRepository {
  // IN MEMORY DATABASE
  private items: Session[] = [];

  // CREATE
  // - create(data: CreateSessionSchema): Promise<Session>;

  async create(data: CreateSessionSchema): Promise<Session> {
    const session = Session.create({
      userId: data.userId,
      ip: data.ip,
      createdAt: new Date(),
    });

    this.items.push(session);

    return session;
  }

  // UPDATE / PATCH
  //  - updateSessionInfo(data: UpdateSessionInfoSchema): Promise<void>;

  async updateSessionInfo(data: UpdateSessionInfoSchema): Promise<void> {
    const session = this.items.find((item) => item.id.equals(data.sessionId));
    if (!session) throw new ResourceNotFoundError('Session not found');

    session.lastUsedAt = new Date();

    if (session.ip.value !== data.ip.value) {
      session.ip = data.ip;
    }
  }

  // DELETE
  //  - revoke(sessionId: UniqueEntityID): Promise<void>;
  //  - expire(sessionId: UniqueEntityID): Promise<void>;

  async revoke(sessionId: UniqueEntityID): Promise<void> {
    const session = this.items.find((s) => s.id.equals(sessionId));
    if (!session) throw new ResourceNotFoundError('Session not found');
    session.revokedAt = new Date();
  }

  async expire(sessionId: UniqueEntityID): Promise<void> {
    const session = this.items.find((item) => item.id.equals(sessionId));
    if (!session) throw new ResourceNotFoundError('Session not found');

    session.expiredAt = new Date();
  }

  // RETRIEVE
  // - listAllActive(): Promise<Session[]>;
  // - listByUser(userId: UniqueEntityID): Promise<Session[]>;
  // - listByUserAndDate(userId: UniqueEntityID, from: Date, to: Date): Promise<Session[]>;

  async listAllActive(): Promise<Session[]> {
    return this.items.filter((item) => !item.expiredAt && !item.revokedAt);
  }

  async listByUser(userId: UniqueEntityID): Promise<Session[]> {
    return this.items.filter((item) => item.userId.equals(userId));
  }

  async listByUserAndDate(
    userId: UniqueEntityID,
    from: Date,
    to: Date,
  ): Promise<Session[]> {
    return this.items.filter(
      (item) =>
        item.userId.equals(userId) &&
        item.createdAt >= from &&
        item.createdAt <= to,
    );
  }
}
