import { prisma } from '@/lib/prisma';
import type { Prisma } from 'generated/prisma';
import type { UsersRepository } from '../users-repository';

export class PrismaUsersRepository implements UsersRepository {
  async update({
    id,
    email,
    role,
  }: {
    id: string;
    email?: string;
    role?: 'USER' | 'MANAGER' | 'ADMIN';
  }) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(email && { email }),
        ...(role && { role }),
      },
    });
    return user;
  }

  async delete(id: string) {
    await prisma.user.delete({
      where: { id },
    });
  }
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });
    return user;
  }
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async listAll() {
    const users = await prisma.user.findMany({ orderBy: { email: 'asc' } });
    return users;
  }
}
