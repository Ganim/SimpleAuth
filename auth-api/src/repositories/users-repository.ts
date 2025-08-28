import type { UserRole } from '@/@types/user-role';
import { User } from '@/entities/core/user';
import { UserProfile } from '@/entities/core/user-profile';
import type { Username } from '@/entities/core/value-objects/username';

export interface CreateUserSchema {
  username: Username;
  email: string;
  passwordHash: string;
  role: UserRole;
  profile: UserProfile;
  deletedAt?: Date | null;
}

export interface UpdateUserSchema {
  id: string;
  email?: string;
  role?: UserRole;
  username?: Username;
  passwordHash?: string;
  profile?: UserProfile;
  deletedAt?: Date | null;
}

export interface UsersRepository {
  // CREATE
  create(data: CreateUserSchema): Promise<User>;

  // UPDATE / PATCH
  update(data: UpdateUserSchema): Promise<User>;

  updateLastLoginAt(id: string, date: Date): Promise<void>;

  // DELETE
  delete(id: string): Promise<void>;

  // RETRIEVE
  findByEmail(email: string): Promise<User | null>;
  findById(id: string, ignoreDeleted?: boolean): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;

  // LIST
  listAll(): Promise<User[]>;
  listAllByRole(role: UserRole): Promise<User[]>;
}
