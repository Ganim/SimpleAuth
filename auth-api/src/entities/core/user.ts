import type { UserRole } from '@/@types/user-role';
import dayjs from 'dayjs';
import { Entity } from '../domain/entities';
import type { Optional } from '../domain/optional';
import type { UniqueEntityID } from '../domain/unique-entity-id';
import type { UserProfile } from './user-profile';

export interface UserProps {
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  lastLoginIp?: string;
  failedLoginAttempts: number;
  blockedUntil?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  deletedAt?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  profile: UserProfile | null;
}

export class User extends Entity<UserProps> {
  get username() {
    return this.props.username;
  }
  get email() {
    return this.props.email;
  }
  get passwordHash() {
    return this.props.passwordHash;
  }
  get role() {
    return this.props.role;
  }
  get lastLoginIp() {
    return this.props.lastLoginIp;
  }
  get failedLoginAttempts() {
    return this.props.failedLoginAttempts;
  }
  get blockedUntil() {
    return this.props.blockedUntil;
  }
  get passwordResetToken() {
    return this.props.passwordResetToken;
  }
  get passwordResetExpires() {
    return this.props.passwordResetExpires;
  }
  get deletedAt() {
    return this.props.deletedAt;
  }
  get lastLoginAt() {
    return this.props.lastLoginAt;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get profile(): UserProfile | null {
    return this.props.profile;
  }

  get isBlocked(): boolean {
    return !!this.blockedUntil && dayjs().isBefore(this.blockedUntil);
  }

  get isDeleted(): boolean {
    return !!this.deletedAt;
  }

  get isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  get isManager(): boolean {
    return this.role === 'MANAGER';
  }

  get isUser(): boolean {
    return this.role === 'USER';
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  set username(username: string | undefined) {
    this.props.username = username ?? '';
    this.touch();
  }

  set passwordHash(hash: string) {
    this.props.passwordHash = hash;
    this.touch();
  }

  set profile(profile: UserProfile | null) {
    this.props.profile = profile;
    this.touch();
  }

  set role(role: UserRole) {
    this.props.role = role;
    this.touch();
  }

  set blockedUntil(date: Date | undefined) {
    this.props.blockedUntil = date;
  }

  set deletedAt(date: Date | undefined) {
    this.props.deletedAt = date;
    this.touch();
  }

  set lastLoginAt(date: Date | undefined) {
    this.props.lastLoginAt = date;
  }

  set failedLoginAttempts(attempts: number) {
    this.props.failedLoginAttempts = attempts;
  }

  static create(
    props: Optional<UserProps, 'createdAt' | 'failedLoginAttempts' | 'role'>,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        role: props.role ?? 'USER',
        failedLoginAttempts: props.failedLoginAttempts ?? 0,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
    return user;
  }
}
