import type { SessionsRepository } from '@/repositories/core/sessions-repository';
import type { FastifyReply } from 'fastify';

export type JwtPayload = { sub: string; role: string; sessionId?: string };

interface RefreshTokenUseCaseRequest {
  sessionId: string;
  ip: string;
  user: JwtPayload;
  reply: FastifyReply;
}

interface RefreshTokenUseCaseResponse {
  token: string;
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute({
    sessionId,
    ip,
    user,
    reply,
  }: RefreshTokenUseCaseRequest): Promise<RefreshTokenUseCaseResponse> {
    await this.sessionsRepository.updateSessionInfo(sessionId, ip);

    const token = await reply.jwtSign(
      { role: user.role, sessionId },
      { sign: { sub: user.sub } },
    );

    const refreshToken = await reply.jwtSign(
      { role: user.role, sessionId },
      { sign: { sub: user.sub, expiresIn: '7d' } },
    );

    return { token, refreshToken };
  }
}
