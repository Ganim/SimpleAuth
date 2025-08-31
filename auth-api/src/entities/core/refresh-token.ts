import { Entity } from '../domain/entities';
import type { UniqueEntityID } from '../domain/unique-entity-id';
import { Token } from './value-objects/token';

export interface RefreshTokenProps {
  userId: UniqueEntityID;
  sessionId: UniqueEntityID;
  token: Token;
  expiresAt: Date;
  createdAt: Date;
  revokedAt?: Date | null;
}

export class RefreshToken extends Entity<RefreshTokenProps> {
  get userId(): UniqueEntityID {
    return this.props.userId;
  }
  get sessionId(): UniqueEntityID {
    return this.props.sessionId;
  }
  get token(): Token {
    return this.props.token;
  }
  get expiresAt(): Date {
    return this.props.expiresAt;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get revokedAt(): Date | null {
    return this.props.revokedAt ?? null;
  }

  get isRevoked(): boolean {
    return !!this.revokedAt;
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  set revokedAt(date: Date | null) {
    this.props.revokedAt = date;
  }

  static create(props: RefreshTokenProps, id?: UniqueEntityID) {
    return new RefreshToken(
      { ...props, revokedAt: props.revokedAt ?? null },
      id,
    );
  }
}
