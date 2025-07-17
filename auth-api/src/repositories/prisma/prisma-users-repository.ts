import { prisma } from '@/lib/prisma';
import type { Prisma } from 'generated/prisma';
import type { UsersRepository } from '../users-repository';

export class PrismaUsersRepository implements UsersRepository {
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
  async findById(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async listAll() {
    const users = await prisma.user.findMany({ orderBy: { email: 'asc' } });
    return users;
  }
}
