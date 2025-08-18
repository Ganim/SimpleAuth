import type { UsersRepository } from '@/repositories/users-repository';
import { compare } from 'bcryptjs';
import type { User } from 'generated/prisma';
import { BadRequestError } from '../@errors/bad-request-error';

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
  ip: string;
}
interface AuthenticateUseCaseResponse {
  user: User;
  sessionId: string;
}

export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private createSessionUseCase: {
      execute: (
        userId: string,
        ip: string,
      ) => Promise<{ session: { id: string } }>;
    },
  ) {}

  async execute({
    email,
    password,
    ip,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user || user.deletedAt) {
      throw new BadRequestError('Invalid credentials');
    }
    const doesPasswordMatches = await compare(password, user.password_hash);
    if (!doesPasswordMatches) {
      throw new BadRequestError('Invalid credentials');
    }
    const { session } = await this.createSessionUseCase.execute(user.id, ip);
    await this.usersRepository.updateLastLoginAt(user.id, new Date());
    return { user, sessionId: session.id };
  }
}
