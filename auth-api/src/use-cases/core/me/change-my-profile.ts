import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UserProfile } from '@/entities/core/user-profile';
import { UserDTO, userToDTO } from '@/mappers/core/user/user-to-dto';
import type { UsersRepository } from '@/repositories/core/users-repository';

interface ChangeMyProfileUseCaseRequest {
  userId: string;
  profile: {
    name?: string;
    surname?: string;
    birthday?: Date;
    location?: string;
    bio?: string;
    avatarUrl?: string;
  };
}

interface ChangeMyProfileUseCaseResponse {
  user: UserDTO;
}

export class ChangeMyProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    profile,
  }: ChangeMyProfileUseCaseRequest): Promise<ChangeMyProfileUseCaseResponse> {
    const existingUser = await this.usersRepository.findById(userId);
    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found');
    }

    const updatedProfile = new UserProfile({
      userId: existingUser.id,
      name: profile.name ?? existingUser.profile?.name ?? '',
      surname: profile.surname ?? existingUser.profile?.surname ?? '',
      birthday: profile.birthday ?? existingUser.profile?.birthday,
      location: profile.location ?? existingUser.profile?.location ?? '',
      bio: profile.bio ?? existingUser.profile?.bio ?? '',
      avatarUrl: profile.avatarUrl ?? existingUser.profile?.avatarUrl ?? '',
      createdAt: existingUser.profile?.createdAt ?? existingUser.createdAt,
      updatedAt: new Date(),
    });

    const updatedUser = await this.usersRepository.update({
      id: userId,
      profile: updatedProfile,
    });

    const user = userToDTO(updatedUser);

    return { user };
  }
}
