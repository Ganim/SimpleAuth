import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { Email } from '@/entities/core/value-objects/email';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
import { EmailService } from '@/services/email-service';
import { makeUser } from '@/utils/tests/factories/core/make-user';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SendPasswordResetTokenUseCase } from './send-password-reset-token';

let usersRepository: InMemoryUsersRepository;
let emailService: EmailService;
let sut: SendPasswordResetTokenUseCase;

describe('SendPasswordResetTokenUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    emailService = {
      sendPasswordResetEmail: vi.fn().mockResolvedValue({ success: true }),
    } as unknown as EmailService;

    sut = new SendPasswordResetTokenUseCase(usersRepository, emailService);
  });

  it('should send password reset email for valid user', async () => {
    await makeUser({
      email: 'johndoe@example.com',
      password: 'Pass@123',
      usersRepository,
    });

    const response = await sut.execute({ email: 'johndoe@example.com' });

    expect(response).toBeUndefined();
    expect(emailService.sendPasswordResetEmail).toHaveBeenCalled();
  });

  it('should throw BadRequestError if user does not exist', async () => {
    await expect(
      sut.execute({ email: 'notfound@example.com' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should update user password reset token and expiration', async () => {
    await makeUser({
      email: 'update@example.com',
      password: 'Pass@123',
      usersRepository,
    });

    await sut.execute({ email: 'update@example.com' });

    const userEmail = Email.create('update@example.com');
    const updatedUser = await usersRepository.findByEmail(userEmail);

    expect(updatedUser?.passwordResetToken).toBeDefined();
    expect(updatedUser?.passwordResetExpires).toBeInstanceOf(Date);
    expect(updatedUser?.passwordResetExpires!.getTime()).toBeGreaterThan(
      Date.now(),
    );
  });
});
