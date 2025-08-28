import type { UserRole } from '@/@types/user-role';
import { User } from '@/entities/core/user';
import { Username } from '@/entities/core/value-objects/username';
import { prisma } from '@/lib/prisma';
import { mapUserPrismaToDomain } from '@/mappers/user/user-prisma-to-domain';
import type {
  CreateUserSchema,
  UpdateUserSchema,
  UsersRepository,
} from '../users-repository';

export class PrismaUsersRepository implements UsersRepository {
  // CREATE
  // create(data: CreateUserSchema): Promise<User>;

  async create(data: CreateUserSchema): Promise<User> {
    const newUserData = await prisma.user.create({
      data: {
        username:
          data.username instanceof Username
            ? data.username.value
            : typeof data.username === 'string'
              ? data.username
              : '',
        email: data.email,
        password_hash: data.passwordHash,
        role: data.role,
        profile: {
          create: {
            name: data.profile.name,
            surname: data.profile.surname,
            birthday: data.profile.birthday,
            location: data.profile.location,
            bio: data.profile.bio,
            avatarUrl: data.profile.avatarUrl,
          },
        },
      },
      include: { profile: true },
    });

    const user = User.create(mapUserPrismaToDomain(newUserData));
    return user;
  }

  // UPDATE / PATCH
  // update(data: UpdateUserSchema): Promise<User>;
  // updateLastLoginAt(id: string, date: Date): Promise<void>;

  async update(data: UpdateUserSchema): Promise<User> {
    const newUserData = await prisma.user.update({
      where: { id: data.id },
      data: {
        ...(data.username && {
          username:
            data.username instanceof Username
              ? data.username.value
              : typeof data.username === 'string'
                ? data.username
                : '',
        }),
        ...(data.email && { email: data.email }),
        ...(data.role && { role: data.role }),
        ...(data.passwordHash && { password_hash: data.passwordHash }),
        profile: data.profile
          ? {
              update: {
                name: data.profile.name,
                surname: data.profile.surname,
                birthday: data.profile.birthday,
                location: data.profile.location,
                bio: data.profile.bio,
                avatarUrl: data.profile.avatarUrl,
              },
            }
          : undefined,
      },
      include: { profile: true },
    });

    const user = User.create(mapUserPrismaToDomain(newUserData));
    return user;
  }

  async updateLastLoginAt(id: string, date: Date) {
    await prisma.user.update({
      where: { id },
      data: { lastLoginAt: date },
    });
  }

  // DELETE
  // delete(id: string): Promise<void>;

  async delete(id: string) {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // RETRIEVE
  // findByEmail(email: string): Promise<User | null>;
  // findById(id: string): Promise<User | null>;
  // findByUsername(username: string): Promise<User | null>;
  async findByEmail(email: string): Promise<User | null> {
    const newUserData = await prisma.user.findFirst({
      where: { email, deletedAt: null },
      include: { profile: true },
    });
    if (!newUserData) return null;
    const user = User.create(mapUserPrismaToDomain(newUserData));
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const newUserData = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: { profile: true },
    });
    if (!newUserData) return null;
    const user = User.create(mapUserPrismaToDomain(newUserData));
    return user;
  }

  async findByUsername(username: string | Username): Promise<User | null> {
    const usernameValue =
      username instanceof Username
        ? username.value
        : typeof username === 'string'
          ? username
          : '';
    const newUserData = await prisma.user.findFirst({
      where: { username: usernameValue, deletedAt: null },
      include: { profile: true },
    });
    if (!newUserData) return null;
    const user = User.create(mapUserPrismaToDomain(newUserData));
    return user;
  }

  // LIST
  // listAll(): Promise<User[]>;
  // listAllByRole(role: UserRole): Promise<User[]>;
  async listAll(): Promise<User[]> {
    const usersDb = await prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { email: 'asc' },
      include: { profile: true },
    });
    return usersDb.map((newUserData) =>
      User.create(mapUserPrismaToDomain(newUserData)),
    );
  }

  async listAllByRole(role: UserRole): Promise<User[]> {
    const usersDb = await prisma.user.findMany({
      where: { role, deletedAt: null },
      orderBy: { email: 'asc' },
      include: { profile: true },
    });
    return usersDb.map((newUserData) =>
      User.create(mapUserPrismaToDomain(newUserData)),
    );
  }
}
