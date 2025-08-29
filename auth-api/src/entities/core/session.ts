import { Entity } from '../domain/entities';
import type { UniqueEntityID } from '../domain/unique-entity-id';
import { IpAddress } from './value-objects/ip-address';

export interface SessionProps {
  userId: UniqueEntityID;
  ip: IpAddress;
  createdAt: Date;
  expiredAt?: Date;
  revokedAt?: Date;
  lastUsedAt?: Date;
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
  get expiredAt(): Date | undefined {
    return this.props.expiredAt;
  }
  get revokedAt(): Date | undefined {
    return this.props.revokedAt;
  }
  get lastUsedAt(): Date | undefined {
    return this.props.lastUsedAt;
  }

  get isRevoked(): boolean {
    return !!this.revokedAt;
  }

  get isExpired(): boolean {
    return this.expiredAt ? new Date() > this.expiredAt : false;
  }

  set revokedAt(date: Date | undefined) {
    this.props.revokedAt = date;
  }

  set lastUsedAt(date: Date | undefined) {
    this.props.lastUsedAt = date;
  }

  static create(props: SessionProps, id?: UniqueEntityID) {
    return new Session(props, id);
  }
}
