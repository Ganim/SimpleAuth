import type { UsersRepository } from '@/repositories/users-repository';
import type { User } from 'generated/prisma';

export class InMemoryUsersRepository implements UsersRepository {
  private items: User[] = [];

  async create(data: { email: string; password_hash: string }) {
    const user = {
      id: String(this.items.length + 1),
      email: data.email,
      password_hash: data.password_hash,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

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
}
