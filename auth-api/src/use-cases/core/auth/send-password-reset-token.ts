import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { PASSWORD_TOKEN_EXPIRATION_TIME } from '@/config/auth';
import { Email } from '@/entities/core/value-objects/email';
import { Token } from '@/entities/core/value-objects/token';
import type { UsersRepository } from '@/repositories/core/users-repository';
import type { EmailService } from '@/services/email-service';
import crypto from 'crypto';

interface SendPasswordResetTokenRequest {
  email: string;
}

export class SendPasswordResetTokenUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private emailService: EmailService,
  ) {}

  async execute({ email }: SendPasswordResetTokenRequest): Promise<void> {
    const validEmail = Email.create(email);

    const existingUser = await this.usersRepository.findByEmail(validEmail);

    if (!existingUser || existingUser.deletedAt) {
      throw new BadRequestError('Invalid credentials');
    }

    const resetTokenHash = crypto.randomBytes(32).toString('hex');
    const validResetToken = Token.create(resetTokenHash);
    const resetTokenExpires = new Date(
      Date.now() + PASSWORD_TOKEN_EXPIRATION_TIME * 60 * 1000,
    ); // 30 minutes from now

    const emailServiceResponse = await this.emailService.sendPasswordResetEmail(
      validEmail,
      validResetToken,
    );

    if (!emailServiceResponse.success) {
      throw new BadRequestError(emailServiceResponse.message);
    }

    await this.usersRepository.updatePasswordReset(
      existingUser.id,
      validResetToken,
      resetTokenExpires,
    );
  }
}
