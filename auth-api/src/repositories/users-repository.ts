import type { UserRole } from '@/@types/user-role';
import type { Prisma, User } from 'generated/prisma/client';

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  listAll(): Promise<User[]>;
  listAllByRole(role: UserRole): Promise<User[]>;
  update(data: Prisma.UserUpdateInput): Promise<User>;
  delete(id: string): Promise<void>; // soft delete
}
