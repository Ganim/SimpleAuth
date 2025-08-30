import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { UserRole } from '@/@types/user-role';
import { Email } from '@/entities/core/value-objects/email';
import { Password } from '@/entities/core/value-objects/password';
import { Url } from '@/entities/core/value-objects/url';
import { Username } from '@/entities/core/value-objects/username';
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
    const validAvatarUrl = new Url(profile?.avatarUrl ? profile.avatarUrl : '');
    const validUsername = username
      ? Username.create(username)
      : Username.random();

    const passwordHash = await Password.hash(password);

    const userWithSameEmail =
      await this.userRespository.findByEmail(validEmail);
    if (userWithSameEmail) {
      throw new BadRequestError('This email is already in use.');
    }

    const userWithSameUsername =
      await this.userRespository.findByUsername(validUsername);
    if (userWithSameUsername) {
      throw new BadRequestError('This username is already in use.');
    }

    const newUser = await this.userRespository.create({
      email: validEmail,
      username: validUsername,
      passwordHash: passwordHash,
      role,
      profile: {
        name: profile?.name ?? '',
        surname: profile?.surname ?? '',
        birthday: profile?.birthday ?? null,
        location: profile?.location ?? '',
        bio: '',
        avatarUrl: validAvatarUrl,
      },
    });

    const user = userToDTO(newUser);

    return {
      user,
    };
  }
}
