import type { UserRole } from '@/@types/user-role';
import { env } from '@/env';
import type { ProfilesRepository } from '@/repositories/profiles-repository';
import type { UsersRepository } from '@/repositories/users-repository';
import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { hash } from 'bcryptjs';
import type { User, UserProfile } from 'generated/prisma';
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
  user: User;
  profile: UserProfile;
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
      throw new BadRequestError('User already exists');
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

    return { user, profile: userProfile };
  }
}
