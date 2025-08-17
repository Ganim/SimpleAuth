import type { UserRole } from '@/@types/user-role';
import { prisma } from '@/lib/prisma';
import type { Prisma } from 'generated/prisma';
import type { UsersRepository } from '../users-repository';

export class PrismaUsersRepository implements UsersRepository {
  // FORMS
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });
    return user;
  }

  async update({
    id,
    username,
    email,
    role,
  }: {
    id: string;
    username?: string;
    email?: string;
    role?: 'USER' | 'MANAGER' | 'ADMIN';
  }) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(username && { username }),
        ...(email && { email }),
        ...(role && { role }),
      },
    });
    return user;
  }

  // SOFT DELETE
  async delete(id: string) {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // FIND
  async findByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
    return user;
  }

  async findById(id: string) {
    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    return user;
  }

  // LIST
  async listAll() {
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { email: 'asc' },
    });
    return users;
  }

  async listAllByRole(role: UserRole) {
    const users = await prisma.user.findMany({
      where: { deletedAt: null, role },
      orderBy: { email: 'asc' },
    });
    return users;
  }
}
