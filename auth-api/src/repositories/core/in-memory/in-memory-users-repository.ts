import { UserRole } from '@/@types/user-role';
import { User } from '@/entities/core/user';
import { UserProfile } from '@/entities/core/user-profile';
import { Email } from '@/entities/core/value-objects/email';
import { Url } from '@/entities/core/value-objects/url';
import { Username } from '@/entities/core/value-objects/username';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import {
  CreateUserSchema,
  UpdateUserSchema,
  UsersRepository,
} from '@/repositories/core/users-repository';

export class InMemoryUsersRepository implements UsersRepository {
  // IN MEMORY DATABASE
  private items: User[] = [];

  // CREATE
  // - create(data: CreateUserSchema): Promise<User>;

  async create(data: CreateUserSchema): Promise<User> {
    const id = new UniqueEntityID();
    const user = User.create({
      id,
      username: data.username,
      email: data.email,
      password: data.passwordHash,
      role: data.role ?? 'USER',
      failedLoginAttempts: 0,
      createdAt: new Date(),
      profile: null,
      deletedAt: data.deletedAt ?? undefined,
    });

    user.profile = UserProfile.create({
      userId: id,
      name: data.profile.name ?? '',
      surname: data.profile.surname ?? '',
      birthday: data.profile.birthday ?? undefined,
      location: data.profile.location ?? '',
      bio: data.profile.bio ?? '',
      avatarUrl: data.profile.avatarUrl ?? Url.empty(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.items.push(user);

    return user;
  }

  // UPDATE / PATCH
  // - update(data: UpdateUserSchema): Promise<User>;
  // - updateLastLoginAt(id: UniqueEntityID, date: Date): Promise<void>;

  async update(data: UpdateUserSchema): Promise<User | null> {
    const user = this.items.find((item) => item.id.equals(data.id));

    if (!user) return null;

    if (data.email) user.email = data.email;
    if (data.role) user.role = data.role;
    if (data.username) user.username = data.username;
    if (data.passwordHash) user.password = data.passwordHash;
    if (data.profile && user.profile) {
      user.profile = UserProfile.create({
        userId: user.id,
        name: data.profile.name ?? user.profile.name,
        surname: data.profile.surname ?? user.profile.surname,
        birthday: data.profile.birthday ?? user.profile.birthday,
        location: data.profile.location ?? user.profile.location,
        bio: data.profile.bio ?? user.profile.bio,
        avatarUrl: data.profile.avatarUrl ?? user.profile.avatarUrl,
        createdAt: user.profile.createdAt,
        updatedAt: new Date(),
      });
    }
    if (data.deletedAt)
      user.deletedAt = data.deletedAt === null ? undefined : data.deletedAt;

    return user;
  }

  async updateLastLoginAt(
    id: UniqueEntityID,
    date: Date,
  ): Promise<User | null> {
    const user = await this.findById(id);

    if (!user) return null;

    user.lastLoginAt = date;

    return user;
  }

  // DELETE
  // - delete(id: UniqueEntityID): Promise<void | null>;

  async delete(id: UniqueEntityID): Promise<void | null> {
    const user = await this.findById(id);

    if (!user) return null;

    user.deletedAt = new Date();
  }

  // RETRIEVE
  // - findByEmail(email: Email): Promise<User | null>;
  // - findById(id: UniqueEntityID): Promise<User | null>;
  // - findByUsername(username: Username): Promise<User | null>;

  async findByEmail(email: Email): Promise<User | null> {
    const user = this.items.find((user) => user.email.equals(email));

    if (!user) return null;

    return user;
  }

  async findById(
    id: UniqueEntityID,
    ignoreDeleted?: boolean,
  ): Promise<User | null> {
    const user = this.items.find((item) => item.id.equals(id));

    if (!user) return null;

    if (!ignoreDeleted && user.isDeleted) return null;

    return user;
  }

  async findByUsername(username: Username): Promise<User | null> {
    const user = this.items.find((item) => item.username.equals(username));

    if (!user) return null;

    return user;
  }

  // LIST
  // - listAll(): Promise<User[] | null>;
  // - listAllByRole(role: UserRole): Promise<User[] | null>;

  async listAll(): Promise<User[] | null> {
    return this.items.filter((user) => !user.isDeleted);
  }

  async listAllByRole(role: UserRole): Promise<User[] | null> {
    return this.items.filter((user) => !user.isDeleted && user.role === role);
  }
}
