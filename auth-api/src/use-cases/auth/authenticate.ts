import type { UsersRepository } from '@/repositories/users-repository';
import { compare } from 'bcryptjs';
import type { User } from 'generated/prisma';
import { BadRequestError } from '../@errors/bad-request-error';

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}
interface AuthenticateUseCaseResponse {
  user: User;
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) {
      throw new BadRequestError('Invalid credentials');
    }

    return { user };
  }
}
