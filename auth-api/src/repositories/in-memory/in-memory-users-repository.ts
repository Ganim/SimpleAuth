import type { UsersRepository } from '@/repositories/users-repository';
import type { User } from 'generated/prisma';

export class InMemoryUsersRepository implements UsersRepository {
  async update({
    id,
    email,
    role,
  }: {
    id: string;
    email?: string;
    role?: 'USER' | 'MANAGER' | 'ADMIN';
  }) {
    const user = await this.findById(id);
    if (!user) throw new Error('User not found');
    if (email) user.email = email;
    if (role) user.role = role;
    user.updatedAt = new Date();
    return user;
  }

  async delete(id: string) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('User not found');
    this.items.splice(index, 1);
  }
  private items: User[] = [];

  async create(data: { email: string; password_hash: string }) {
    const user: User = {
      id: String(this.items.length + 1),
      email: data.email,
      password_hash: data.password_hash,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'USER',
    };

    this.items.push(user);
    return user;
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async listAll() {
    if (this.items.length === 0) {
      return null;
    }

    return this.items;
  }
}
