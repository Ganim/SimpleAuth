import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { Password } from '@/entities/core/value-objects/password';
import { Token } from '@/entities/core/value-objects/token';
import { UsersRepository } from '@/repositories/core/users-repository';

import dayjs from 'dayjs';

interface ResetPasswordByTokenRequest {
  token: string;
  password: string;
}

export class ResetPasswordByTokenUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    token,
    password,
  }: ResetPasswordByTokenRequest): Promise<void> {
    const validToken = Token.create(token);
    const validPassword = await Password.create(password);

    const existingUser =
      await this.usersRepository.findByPasswordResetToken(validToken);

    const isTokenExpired = dayjs().isAfter(existingUser?.passwordResetExpires);

    if (!existingUser || !existingUser.passwordResetExpires || isTokenExpired) {
      throw new BadRequestError('Token inválido ou expirado');
    }

    const updatedUser = await this.usersRepository.update({
      id: existingUser.id,
      passwordHash: validPassword,
    });

    if (!updatedUser) {
      throw new BadRequestError('Unable to update user password.');
    }
  }
}
