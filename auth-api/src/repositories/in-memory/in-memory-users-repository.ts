import type { UserRole } from '@/@types/user-role';
import { User } from '@/entities/core/user';
import { UserProfile } from '@/entities/core/user-profile';
import { Username } from '@/entities/core/value-objects/username';
import type {
  CreateUserSchema,
  UpdateUserSchema,
  UsersRepository,
} from '@/repositories/users-repository';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found';

export class InMemoryUsersRepository implements UsersRepository {
  // IN MEMORY DATABASE
  private items: User[] = [];

  // CREATE
  // create(data: CreateUserSchema): Promise<User>;

  async create(data: CreateUserSchema): Promise<User> {
    // Cria perfil com id temporário
    // Cria usuário com profile: null
    const user = User.create({
      username:
        data.username instanceof Username
          ? data.username
          : Username.create(data.username ?? ''),
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role ?? 'USER',
      failedLoginAttempts: 0,
      createdAt: new Date(),
      profile: data.profile ?? null,
    });

    // Cria o profile
    if (!data.profile) {
      user.profile = new UserProfile({
        userId: user.id,
        name: '',
        surname: '',
        birthday: undefined,
        location: '',
        bio: '',
        avatarUrl: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    this.items.push(user);
    return user;
  }

  // UPDATE / PATCH
  // update(data: UpdateUserSchema): Promise<User>;
  // updateLastLoginAt(id: string, date: Date): Promise<void>;

  async update(data: UpdateUserSchema) {
    // Verify user exists
    const user = await this.findById(data.id);
    if (!user) throw new ResourceNotFoundError('User not found');

    // Update
    if (data.email) user.email = data.email;
    if (data.role) user.role = data.role;
    if (data.username !== undefined) {
      user.username =
        data.username instanceof Username
          ? data.username
          : Username.create(data.username ?? '');
    }
    if (data.passwordHash !== undefined) user.passwordHash = data.passwordHash;
    if (data.profile !== undefined && user.profile) {
      user.profile = new UserProfile({
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

    return user;
  }

  async updateLastLoginAt(id: string, date: Date): Promise<void> {
    // Verify user exists
    const user = await this.findById(id);
    if (!user) throw new ResourceNotFoundError('User not found');

    // Update
    user.lastLoginAt = date;
  }

  // DELETE
  // delete(id: string): Promise<void>;

  async delete(id: string) {
    // Verify user exists
    const user = await this.findById(id);
    if (!user) throw new ResourceNotFoundError('User not found');

    // Delete
    user.deletedAt = new Date();
  }

  // RETRIEVE
  // findByEmail(email: string): Promise<User | null>;
  // findById(id: string): Promise<User | null>;
  // findByUsername(username: string): Promise<User | null>;

  async findByEmail(email: string) {
    // Verify user exists and its not deleted
    const user = this.items.find(
      (item) => item.email === email && !item.isDeleted,
    );

    // Return User
    return user ?? null;
  }

  async findById(id: string) {
    // Verify user exists and its not deleted
    const user = this.items.find(
      (item) => item.id.toString() === id && !item.isDeleted,
    );

    // Return User
    return user ?? null;
  }

  async findByUsername(username: string | Username): Promise<User | null> {
    const usernameValue =
      username instanceof Username ? username.value : username;
    const user = this.items.find(
      (item) => item.username.value === usernameValue && !item.isDeleted,
    );
    return user ?? null;
  }

  // LIST
  // listAll(): Promise<User[]>;
  // listAllByRole(role: UserRole): Promise<User[]>;

  async listAll() {
    // Return All Not Deleted Users
    return this.items.filter((user) => !user.isDeleted);
  }

  async listAllByRole(role: UserRole) {
    // Return All Not Deleted Users by Role
    return this.items.filter((user) => !user.isDeleted && user.role === role);
  }
}
