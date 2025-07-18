import type { Prisma, User } from 'generated/prisma/client';

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  listAll(): Promise<User[] | null>;
  update(data: {
    id: string;
    email?: string;
    role?: 'USER' | 'MANAGER' | 'ADMIN';
  }): Promise<User>;
  delete(id: string): Promise<void>;
}
