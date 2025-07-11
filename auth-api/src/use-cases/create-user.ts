import type { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface createUserUseCaseParams {
  email: string;
  password: string;
}

export class CreteUserUseCase {
  constructor(private userRespository: UsersRepository) {}

  async execute({ email, password }: createUserUseCaseParams) {
    const hashRounds = 6;
    const password_hash = await hash(password, hashRounds);

    const userWithSameEmail = await this.userRespository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    await this.userRespository.create({
      email,
      password_hash,
    });
  }
}
