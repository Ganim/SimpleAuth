import { PrismaUsersRepository } from '@/repositories/core/prisma/prisma-users-repository';
import { EmailService } from '@/services/email-service';
import { SendPasswordResetTokenUseCase } from '../send-password-reset-token';

export function makeSendPasswordResetTokenUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const emailService = new EmailService();
  return new SendPasswordResetTokenUseCase(usersRepository, emailService);
}
