import type { ProfilesRepository } from '@/repositories/profiles-repository';
import type { UsersRepository } from '@/repositories/users-repository';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found';

type GetMyProfileUseCaseRequest = {
  userId: string;
};

type GetMyProfileUseCaseResponse = {
  profile: {
    id: string;
    userId: string;
    name: string;
    surname: string;
    birthday: string;
    location: string;
    bio: string;
    avatarUrl: string;
    email: string;
    username: string;
  };
};

export class GetMyProfileUseCase {
  private usersRepository: UsersRepository;
  private profilesRepository: ProfilesRepository;

  constructor(
    usersRepository: UsersRepository,
    profilesRepository: ProfilesRepository,
  ) {
    this.usersRepository = usersRepository;
    this.profilesRepository = profilesRepository;
  }

  async execute({
    userId,
  }: GetMyProfileUseCaseRequest): Promise<GetMyProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new ResourceNotFoundError('User not found');

    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) throw new ResourceNotFoundError('Profile not found');

    const formattedBirthday = profile.birthday
      ? new Date(profile.birthday).toLocaleDateString('pt-BR')
      : '';

    return {
      profile: {
        id: profile.id,
        userId: user.id,
        name: profile.name ?? '',
        surname: profile.surname ?? '',
        location: profile.location ?? '',
        bio: profile.bio ?? '',
        birthday: formattedBirthday,
        avatarUrl: profile.avatarUrl ?? '',
        email: user.email,
        username: user.username ?? '',
      },
    };
  }
}
