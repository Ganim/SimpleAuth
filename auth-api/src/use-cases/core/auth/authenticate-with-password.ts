import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { Email } from '@/entities/core/value-objects/email';
import { UserDTO, userToDTO } from '@/mappers/core/user/user-to-dto';
import type { SessionsRepository } from '@/repositories/core/sessions-repository';
import type { UsersRepository } from '@/repositories/core/users-repository';
import { compare } from 'bcryptjs';

interface AuthenticateWithPasswordUseCaseRequest {
  email: string;
  password: string;
  ip: string;
}
interface AuthenticateWithPasswordUseCaseResponse {
  user: UserDTO;
  sessionId: string;
}

export class AuthenticateWithPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private sessionsRepository: SessionsRepository,
  ) {}

  async execute({
    email,
    password,
    ip,
  }: AuthenticateWithPasswordUseCaseRequest): Promise<AuthenticateWithPasswordUseCaseResponse> {
    const validEmail = new Email(email);

    const existingUser = await this.usersRepository.findByEmail(validEmail);

    if (!existingUser || existingUser.isDeleted) {
      throw new BadRequestError('Invalid credentials');
    }

    const doesPasswordMatches = await compare(
      password,
      existingUser.passwordHash,
    );

    if (!doesPasswordMatches) {
      throw new BadRequestError('Invalid credentials');
    }

    const session = await this.sessionsRepository.create({
      userId: existingUser.id.toString(),
      ip,
    });

    existingUser.lastLoginAt = new Date();

    await this.usersRepository.updateLastLoginAt(
      existingUser.id.toString(),
      existingUser.lastLoginAt,
    );

    const user = userToDTO(existingUser);

    return { user, sessionId: session.id };
  }
}
