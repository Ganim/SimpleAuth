import { env } from '@/env';
import type { ProfilesRepository } from '@/repositories/profiles-repository';
import type { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import type { User, UserProfile } from 'generated/prisma';
import { BadRequestError } from '../@errors/bad-request-error';

interface createUserAndProfileUseCaseRequest {
  email: string;
  password: string;
  profile?: {
    name?: string;
    surname?: string;
    birthday?: Date;
    location?: string;
  };
}

interface createUserAndProfileUseCaseResponse {
  user: User;
  profile: UserProfile;
}

export class CreateUserAndProfileUseCase {
  constructor(
    private userRespository: UsersRepository,
    private profileRepository: ProfilesRepository,
  ) {}

  async execute({
    email,
    password,
    profile = {},
  }: createUserAndProfileUseCaseRequest): Promise<createUserAndProfileUseCaseResponse> {
    const password_hash = await hash(password, env.HASH_ROUNDS);

    const userWithSameEmail = await this.userRespository.findByEmail(email);

    if (userWithSameEmail) {
      throw new BadRequestError('User already exists');
    }

    const user = await this.userRespository.create({
      email,
      password_hash,
    });

    const userProfile = await this.profileRepository.create({
      user: { connect: { id: user.id } },
      name: profile.name ?? '',
      surname: profile.surname ?? '',
      birthday: profile.birthday ?? undefined,
      location: profile.location ?? '',
    });

    return { user, profile: userProfile };
  }
}
