import type { UserRole } from '@/@types/user-role';
import type { UsersRepository } from '@/repositories/users-repository';
import type { Prisma, User } from 'generated/prisma/client';

export class InMemoryUsersRepository implements UsersRepository {
  private items: User[] = [];

  // FORMS

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: String(this.items.length + 1),
      username: data.username ?? null,
      email: data.email,
      password_hash: data.password_hash,
      role: (data.role as UserRole) ?? 'USER',
      lastLoginIp: null,
      failedLoginAttempts: 0,
      blockedUntil: null,
      deletedAt: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(user);
    return user;
  }

  async update({
    id,
    email,
    role,
    username,
    password_hash,
  }: {
    id: string;
    email?: string;
    role?: 'USER' | 'MANAGER' | 'ADMIN';
    username?: string;
    password_hash?: string;
  }) {
    const user = await this.findById(id);
    if (!user) throw new Error('User not found');
    if (email) user.email = email;
    if (role) user.role = role;
    if (username !== undefined) user.username = username;
    if (password_hash !== undefined) user.password_hash = password_hash;
    user.updatedAt = new Date();
    return user;
  }

  // SOFT DELETE

  async delete(id: string) {
    const user = await this.findById(id);
    if (!user) throw new Error('User not found');
    user.deletedAt = new Date();
  }

  // FIND
  async findByEmail(email: string) {
    const user = this.items.find(
      (item) => item.email === email && !item.deletedAt,
    );
    return user ?? null;
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id && !item.deletedAt);
    return user ?? null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = this.items.find(
      (item) => item.username === username && !item.deletedAt,
    );
    return user ?? null;
  }

  // LIST
  async listAll() {
    return this.items.filter((user) => !user.deletedAt);
  }

  async listAllByRole(role: UserRole) {
    return this.items.filter((user) => !user.deletedAt && user.role === role);
  }
}
