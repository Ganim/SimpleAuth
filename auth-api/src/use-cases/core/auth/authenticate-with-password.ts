import type { UsersRepository } from '@/repositories/users-repository';
import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { compare } from 'bcryptjs';
import type { User } from 'generated/prisma';

interface AuthenticateWithPasswordUseCaseRequest {
  email: string;
  password: string;
  ip: string;
}
interface AuthenticateWithPasswordUseCaseResponse {
  user: User;
  sessionId: string;
}

export class AuthenticateWithPasswordUseCase {
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
  }: AuthenticateWithPasswordUseCaseRequest): Promise<AuthenticateWithPasswordUseCaseResponse> {
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
