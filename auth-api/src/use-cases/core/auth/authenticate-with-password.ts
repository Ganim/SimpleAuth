import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { Email } from '@/entities/core/value-objects/email';
import { Password } from '@/entities/core/value-objects/password';
import { UserDTO, userToDTO } from '@/mappers/core/user/user-to-dto';
import type { UsersRepository } from '@/repositories/core/users-repository';
import type { FastifyReply } from 'fastify';
import { CreateSessionUseCase } from '../sessions/create-session';

interface AuthenticateWithPasswordUseCaseRequest {
  email: string;
  password: string;
  ip: string;
  reply: FastifyReply;
}
interface AuthenticateWithPasswordUseCaseResponse {
  user: UserDTO;
  sessionId: string;
  token: string;
  refreshToken: string;
}

export class AuthenticateWithPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private createSessionUseCase: CreateSessionUseCase,
  ) {}

  async execute({
    email,
    password,
    ip,
    reply,
  }: AuthenticateWithPasswordUseCaseRequest): Promise<AuthenticateWithPasswordUseCaseResponse> {
    const validEmail = new Email(email);

    const existingUser = await this.usersRepository.findByEmail(validEmail);

    if (!existingUser || existingUser.deletedAt) {
      throw new BadRequestError('Invalid credentials');
    }

    const doesPasswordMatches = await Password.compare(
      password,
      existingUser.password.toString(),
    );

    if (!doesPasswordMatches) {
      throw new BadRequestError('Invalid credentials');
    }

    existingUser.lastLoginAt = new Date();

    await this.usersRepository.updateLastLoginAt(
      existingUser.id,
      existingUser.lastLoginAt,
    );

    const { session, token, refreshToken } =
      await this.createSessionUseCase.execute({
        userId: existingUser.id.toString(),
        ip,
        reply,
      });

    const user = userToDTO(existingUser);

    return { user, sessionId: session.id, token, refreshToken };
  }
}
