import { env } from '@/env';
import type { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import type { User } from 'generated/prisma';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

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
      throw new UserAlreadyExistsError();
    }

    const user = await this.userRespository.create({
      email,
      password_hash,
    });

    return { user };
  }
}
