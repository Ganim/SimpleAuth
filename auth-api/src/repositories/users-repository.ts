import type { UserRole } from '@/@types/user-role';
import { User } from '@/entities/core/user';
import { UserProfile } from '@/entities/core/user-profile';
import type { Email } from '@/entities/core/value-objects/email';
import type { Password } from '@/entities/core/value-objects/password';
import type { Username } from '@/entities/core/value-objects/username';
import type { UniqueEntityID } from '@/entities/domain/unique-entity-id';

export interface CreateUserSchema {
  username: Username;
  email: Email;
  passwordHash: Password;
  role: UserRole;
  profile: UserProfile;
  deletedAt?: Date | null;
}

export interface UpdateUserSchema {
  id: UniqueEntityID;
  email?: Email;
  role?: UserRole;
  username?: Username;
  passwordHash?: Password;
  profile?: UserProfile;
  deletedAt?: Date | null;
}

export interface UsersRepository {
  // CREATE
  create(data: CreateUserSchema): Promise<User>;

  // UPDATE / PATCH
  update(data: UpdateUserSchema): Promise<User>;

  updateLastLoginAt(id: UniqueEntityID, date: Date): Promise<void>;

  // DELETE
  delete(id: UniqueEntityID): Promise<void>;

  // RETRIEVE
  findByEmail(email: Email): Promise<User | null>;
  findById(id: UniqueEntityID, ignoreDeleted?: boolean): Promise<User | null>;
  findByUsername(username: Username): Promise<User | null>;

  // LIST
  listAll(): Promise<User[]>;
  listAllByRole(role: UserRole): Promise<User[]>;
}
