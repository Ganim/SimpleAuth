import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { UserRole } from '@/@types/user-role';
import { UserProfile } from '@/entities/core/user-profile';
import { Email } from '@/entities/core/value-objects/email';
import { Password } from '@/entities/core/value-objects/password';
import { Username } from '@/entities/core/value-objects/username';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { UserDTO, userToDTO } from '@/mappers/core/user/user-to-dto';
import { UsersRepository } from '@/repositories/core/users-repository';

interface RegisterNewUserUseCaseRequest {
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

interface RegisterNewUserUseCaseResponse {
  user: UserDTO;
}

export class RegisterNewUserUseCase {
  constructor(private userRespository: UsersRepository) {}

  async execute({
    username,
    email,
    password,
    role = 'USER',
    profile = {},
  }: RegisterNewUserUseCaseRequest): Promise<RegisterNewUserUseCaseResponse> {
    const validEmail = new Email(email);

    const userWithSameEmail =
      await this.userRespository.findByEmail(validEmail);

    if (userWithSameEmail) {
      throw new BadRequestError('This email is already in use.');
    }

    const validUsername = username
      ? Username.create(username)
      : Username.random();

    const userWithSameUsername = await this.userRespository.findByUsername(
      validUsername.toString(),
    );
    if (userWithSameUsername) {
      throw new BadRequestError('This username is already in use.');
    }

    const passwordHash = await Password.hash(password);

    const exactDate = new Date();

    const emptyProfile = new UserProfile({
      userId: new UniqueEntityID(),
      name: profile?.name ?? '',
      surname: profile?.surname ?? '',
      birthday: profile?.birthday ?? undefined,
      location: profile?.location ?? '',
      bio: '',
      avatarUrl: profile?.avatarUrl ?? '',
      createdAt: exactDate,
      updatedAt: exactDate,
    });

    const newUser = await this.userRespository.create({
      username: validUsername,
      email: validEmail,
      passwordHash,
      role,
      profile: emptyProfile,
    });

    const userProfile = new UserProfile({
      userId: new UniqueEntityID(newUser.id.toString()),
      name: profile?.name ?? '',
      surname: profile?.surname ?? '',
      birthday: profile?.birthday ?? undefined,
      location: profile?.location ?? '',
      bio: '',
      avatarUrl: profile?.avatarUrl ?? '',
      createdAt: exactDate,
      updatedAt: exactDate,
    });

    await this.userRespository.update({
      id: newUser.id.toString(),
      profile: userProfile,
    });

    newUser.profile = userProfile;

    const user = userToDTO(newUser);

    return {
      user,
    };
  }
}
