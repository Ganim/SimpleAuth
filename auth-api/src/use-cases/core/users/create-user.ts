import type { UserRole } from '@/@types/user-role';
import { env } from '@/env';
import type { ProfilesRepository } from '@/repositories/profiles-repository';
import type { UsersRepository } from '@/repositories/users-repository';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found';
import { hash } from 'bcryptjs';
import { randomUUID } from 'node:crypto';

interface CreateUserUseCaseRequest {
  username?: string;
  email: string;
  password: string;
  role?: UserRole;
  profile?: {
    name?: string;
    surname?: string;
    birthday?: Date;
    location?: string;
    avatarUrl?: string;
  };
}

interface CreateUserUseCaseResponse {
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
    lastLoginAt: Date;
    profile: {
      name: string;
      surname: string;
      birthday: Date;
      location: string;
      bio: string;
      avatarUrl: string;
    };
  };
}

export class CreateUserUseCase {
  constructor(
    private userRespository: UsersRepository,
    private profileRepository: ProfilesRepository,
  ) {}

  async execute({
    username,
    email,
    password,
    role = 'USER',
    profile = {},
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const password_hash = await hash(password, env.HASH_ROUNDS);

    const userWithSameEmail = await this.userRespository.findByEmail(email);
    if (userWithSameEmail) {
      throw new ResourceNotFoundError('User already exists');
    }

    // Gera username único se não informado
    let finalUsername = username;
    if (!finalUsername || finalUsername.trim() === '') {
      finalUsername = `user${randomUUID().slice(0, 8)}`;
    }

    const user = await this.userRespository.create({
      username: finalUsername,
      email,
      password_hash,
      role,
    });

    const userProfile = await this.profileRepository.create({
      user: { connect: { id: user.id } },
      name: profile?.name ?? '',
      surname: profile?.surname ?? '',
      birthday: profile?.birthday ?? undefined,
      location: profile?.location ?? '',
      avatarUrl: profile?.avatarUrl ?? '',
    });

    const formatedUser = {
      id: user.id,
      email: user.email,
      username: user.username ?? '',
      role: user.role,
      lastLoginAt: user.lastLoginAt ?? new Date(0),
      profile: {
        name: userProfile.name,
        surname: userProfile.surname,
        birthday: userProfile.birthday ?? new Date(0),
        location: userProfile.location,
        bio: userProfile.bio,
        avatarUrl: userProfile.avatarUrl,
      },
    };

    return { user: formatedUser };
  }
}
