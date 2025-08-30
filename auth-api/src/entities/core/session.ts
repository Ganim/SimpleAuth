import { Entity } from '../domain/entities';
import type { UniqueEntityID } from '../domain/unique-entity-id';
import { IpAddress } from './value-objects/ip-address';

export interface SessionProps {
  userId: UniqueEntityID;
  ip: IpAddress;
  createdAt: Date;
  expiredAt?: Date | null;
  revokedAt?: Date | null;
  lastUsedAt?: Date | null;
}

export class Session extends Entity<SessionProps> {
  get userId(): UniqueEntityID {
    return this.props.userId;
  }
  get ip(): IpAddress {
    return this.props.ip;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get expiredAt(): Date | null {
    return this.props.expiredAt ?? null;
  }
  get revokedAt(): Date | null {
    return this.props.revokedAt ?? null;
  }
  get lastUsedAt(): Date | null {
    return this.props.lastUsedAt ?? null;
  }

  get isRevoked(): boolean {
    return !!this.revokedAt;
  }

  get isExpired(): boolean {
    return this.expiredAt ? new Date() > this.expiredAt : false;
  }

  set ip(ip: IpAddress) {
    this.props.ip = ip;
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  set expiredAt(expiredAt: Date | null) {
    this.props.expiredAt = expiredAt;
  }

  set revokedAt(date: Date | null) {
    this.props.revokedAt = date;
  }

  set lastUsedAt(date: Date | null) {
    this.props.lastUsedAt = date;
  }

  static create(props: SessionProps, id?: UniqueEntityID) {
    return new Session(
      {
        ...props,
        expiredAt: props.expiredAt ?? null,
        revokedAt: props.revokedAt ?? null,
        lastUsedAt: props.lastUsedAt ?? null,
      },
      id,
    );
  }
}
