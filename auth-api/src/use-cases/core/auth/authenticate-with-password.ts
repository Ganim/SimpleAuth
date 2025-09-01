import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { UserBlockedError } from '@/@errors/use-cases/user-blocked-error';
import { BLOCK_MINUTES, MAX_ATTEMPTS } from '@/config/auth';
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
    const validEmail = Email.create(email);

    const existingUser = await this.usersRepository.findByEmail(validEmail);

    if (!existingUser || existingUser.deletedAt) {
      throw new BadRequestError('Invalid credentials');
    }

    if (existingUser.blockedUntil && new Date() < existingUser.blockedUntil) {
      throw new UserBlockedError(existingUser.blockedUntil);
    }

    const doesPasswordMatches = await Password.compare(
      password,
      existingUser.password.toString(),
    );

    if (!doesPasswordMatches) {
      existingUser.failedLoginAttempts += 1;

      if (existingUser.failedLoginAttempts >= MAX_ATTEMPTS) {
        existingUser.blockedUntil = new Date(
          Date.now() + BLOCK_MINUTES * 60 * 1000,
        );

        await this.usersRepository.update({
          id: existingUser.id,
          blockedUntil: existingUser.blockedUntil,
          failedLoginAttempts: existingUser.failedLoginAttempts,
        });

        throw new UserBlockedError(existingUser.blockedUntil);
      } else {
        await this.usersRepository.update({
          id: existingUser.id,
          failedLoginAttempts: existingUser.failedLoginAttempts,
        });
      }

      throw new BadRequestError('Invalid credentials');
    }

    existingUser.failedLoginAttempts = 0;
    existingUser.blockedUntil = undefined;

    await this.usersRepository.update({
      id: existingUser.id,
      failedLoginAttempts: 0,
      blockedUntil: null,
    });

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
