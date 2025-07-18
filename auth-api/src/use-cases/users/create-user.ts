import { env } from '@/env';
import type { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import type { User } from 'generated/prisma';
import { BadRequestError } from '../@errors/bad-request-error';

interface createUserUseCaseRequest {
  email: string;
  password: string;
}

interface createUserUseCaseResponse {
  user: User;
}

export class CreateUserUseCase {
  constructor(private userRespository: UsersRepository) {}

  async execute({
    email,
    password,
  }: createUserUseCaseRequest): Promise<createUserUseCaseResponse> {
    const password_hash = await hash(password, env.HASH_ROUNDS);

    const userWithSameEmail = await this.userRespository.findByEmail(email);

    if (userWithSameEmail) {
      throw new BadRequestError('User already exists');
    }

    const user = await this.userRespository.create({
      email,
      password_hash,
    });

    return { user };
  }
}
