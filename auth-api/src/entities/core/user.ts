import dayjs from 'dayjs';
import { Entity } from '../domain/entities';
import { Optional } from '../domain/optional';
import { UniqueEntityID } from '../domain/unique-entity-id';
import { UserProfile } from './user-profile';
import { Email } from './value-objects/email';
import { IpAddress } from './value-objects/ip-address';
import { Password } from './value-objects/password';
import { Role } from './value-objects/role';
import { Token } from './value-objects/token';
import { Username } from './value-objects/username';

export interface UserProps {
  id: UniqueEntityID;
  username: Username;
  email: Email;
  password: Password;
  role: Role;
  lastLoginIp?: IpAddress;
  failedLoginAttempts: number;
  blockedUntil?: Date;
  passwordResetToken?: Token;
  passwordResetExpires?: Date;
  deletedAt?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  profile: UserProfile | null;
}

export class User extends Entity<UserProps> {
  get id(): UniqueEntityID {
    return this.props.id;
  }
  get username(): Username {
    return this.props.username;
  }
  get email(): Email {
    return this.props.email;
  }
  get password(): Password {
    return this.props.password;
  }
  get role(): Role {
    return this.props.role;
  }
  get lastLoginIp(): IpAddress | undefined {
    return this.props.lastLoginIp;
  }
  get failedLoginAttempts(): number {
    return this.props.failedLoginAttempts;
  }
  get blockedUntil(): Date | undefined {
    return this.props.blockedUntil;
  }
  get passwordResetToken(): Token | undefined {
    return this.props.passwordResetToken;
  }
  get passwordResetExpires(): Date | undefined {
    return this.props.passwordResetExpires;
  }
  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }
  get lastLoginAt(): Date | undefined {
    return this.props.lastLoginAt;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date | undefined {
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

  private touch() {
    this.props.updatedAt = new Date();
  }

  set email(email: Email) {
    this.props.email = email;
    this.touch();
  }

  set username(username: Username) {
    this.props.username = username;
    this.touch();
  }

  set password(password: Password) {
    this.props.password = password;
    this.touch();
  }

  set profile(profile: UserProfile | null) {
    this.props.profile = profile;
    this.touch();
  }

  set role(role: Role) {
    this.props.role = role;
    this.touch();
  }

  set blockedUntil(date: Date | undefined) {
    this.props.blockedUntil = date;
  }

  set passwordResetExpires(date: Date | undefined) {
    this.props.passwordResetExpires = date;
  }

  set deletedAt(date: Date | undefined) {
    this.props.deletedAt = date;
    this.touch();
  }

  set lastLoginIp(ip: IpAddress | undefined) {
    this.props.lastLoginIp = ip;
  }

  set lastLoginAt(date: Date | undefined) {
    this.props.lastLoginAt = date;
  }

  set passwordResetToken(token: Token | undefined) {
    this.props.passwordResetToken = token;
  }

  set failedLoginAttempts(attempts: number) {
    this.props.failedLoginAttempts = attempts;
  }

  static create(
    props: Optional<
      UserProps,
      'createdAt' | 'failedLoginAttempts' | 'role' | 'deletedAt'
    >,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        role: props.role ?? Role.create('USER'),
        failedLoginAttempts: props.failedLoginAttempts ?? 0,
        createdAt: props.createdAt ?? new Date(),
        deletedAt: props.deletedAt ?? undefined,
      },
      id,
    );
    return user;
  }
}
