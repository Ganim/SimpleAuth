import { Email } from '@/entities/core/value-objects/email';
import { Token } from '@/entities/core/value-objects/token';
import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import type MimeNode from 'nodemailer/lib/mime-node';

interface EmailServiceResponse {
  success: boolean;
  message?: string;
  return?:
    | {
        envelope: MimeNode.Envelope;
        messageId: string;
        accepted: Array<string | Mail.Address>;
        rejected: Array<string | Mail.Address>;
        pending: Array<string | Mail.Address>;
        response: string;
      }
    | unknown;
}

export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true para 465, false para outros
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendPasswordResetEmail(
    email: Email,
    token: Token,
  ): Promise<EmailServiceResponse> {
    await this.transporter.verify();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token.toString()}`;

    try {
      const sentInformation = await this.transporter.sendMail({
        from: '"SimpleAuth" <no-reply@simpleauth.com>',
        to: email.toString(),
        subject: 'Recuperação de senha',
        html: `
        <p>Você solicitou a recuperação de senha.</p>
        <p>Clique <a href="${resetUrl}">aqui</a> para redefinir sua senha.</p>
        <p>Se não foi você, ignore este e-mail.</p>
      `,
      });

      return {
        success: true,
        message: 'Password reset email sent successfully.',
        return: sentInformation,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send password reset email.',
        return: error,
      };
    }
  }
}
