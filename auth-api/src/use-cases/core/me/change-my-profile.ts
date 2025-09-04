import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UserProfile } from '@/entities/core/user-profile';
import { Url } from '@/entities/core/value-objects/url';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
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
    const validId = new UniqueEntityID(userId);

    const existingUser = await this.usersRepository.findById(validId);
    if (!existingUser || existingUser.deletedAt) {
      throw new ResourceNotFoundError('User not found');
    }

    const profileData = {
      userId: existingUser.id,
      name: profile.name ?? existingUser.profile?.name ?? '',
      surname: profile.surname ?? existingUser.profile?.surname ?? '',
      birthday: profile.birthday ?? existingUser.profile?.birthday,
      location: profile.location ?? existingUser.profile?.location ?? '',
      bio: profile.bio ?? existingUser.profile?.bio ?? '',
      avatarUrl: profile.avatarUrl
        ? Url.create(profile.avatarUrl)
        : existingUser.profile?.avatarUrl
          ? existingUser.profile.avatarUrl
          : Url.empty(),
      createdAt: existingUser.profile?.createdAt ?? existingUser.createdAt,
      updatedAt: new Date(),
    };

    const updatedProfile = UserProfile.create(profileData);

    const updatedUser = await this.usersRepository.update({
      id: validId,
      profile: updatedProfile,
    });

    if (!updatedUser) {
      throw new BadRequestError('Unable to update user profile.');
    }

    const user = userToDTO(updatedUser);

    return { user };
  }
}
