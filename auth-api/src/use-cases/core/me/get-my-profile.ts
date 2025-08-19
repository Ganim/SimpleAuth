import type { ProfilesRepository } from '@/repositories/profiles-repository';
import type { UsersRepository } from '@/repositories/users-repository';

type GetMyProfileUseCaseRequest = {
  userId: string;
};

type GetMyProfileUseCaseResponse = {
  profile: {
    id: string;
    userId: string;
    name: string;
    surname: string;
    location: string | null;
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
    if (!user) {
      throw new Error('User not found');
    }
    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    return {
      profile: {
        id: profile.id,
        userId: user.id,
        name: profile.name ?? '',
        surname: profile.surname ?? '',
        location: profile.location,
        email: user.email,
        username: user.username ?? '',
      },
    };
  }
}
