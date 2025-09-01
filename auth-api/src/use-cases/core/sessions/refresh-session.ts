import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { IpAddress } from '@/entities/core/value-objects/ip-address';
import { Token } from '@/entities/core/value-objects/token';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import {
    refreshTokenToDTO,
    type RefreshTokenDTO,
} from '@/mappers/core/refresh-token/refresh-token-to-dto';
import {
    sessionToDTO,
    type SessionDTO,
} from '@/mappers/core/session/session-to-dto';
import { RefreshTokensRepository } from '@/repositories/core/refresh-tokens-repository';
import { SessionsRepository } from '@/repositories/core/sessions-repository';
import type { UsersRepository } from '@/repositories/core/users-repository';
import type { FastifyReply } from 'fastify';

export interface RefreshSessionUseCaseRequest {
  sessionId: string;
  userId: string;
  ip: string;
  reply: FastifyReply;
}

export interface RefreshSessionUseCaseResponse {
  session: SessionDTO;
  refreshToken: RefreshTokenDTO;
}

export class RefreshSessionUseCase {
  constructor(
    private sessionsRepository: SessionsRepository,
    private usersRepository: UsersRepository,
    private refreshTokensRepository: RefreshTokensRepository,
  ) {}

  async execute({
    sessionId,
    userId,
    ip,
    reply,
  }: RefreshSessionUseCaseRequest): Promise<RefreshSessionUseCaseResponse> {
    const validSessionId = new UniqueEntityID(sessionId);
    const validUserId = new UniqueEntityID(userId);
    const validIp = IpAddress.create(ip);

    const storedUser = await this.usersRepository.findById(validUserId);

    if (!storedUser) {
      throw new ResourceNotFoundError('User not found.');
    }

    const storedSession =
      await this.sessionsRepository.findById(validSessionId);

    if (!storedSession) {
      throw new ResourceNotFoundError('Session not found.');
    }

    const tokens =
      await this.refreshTokensRepository.listBySession(validSessionId);
    if (!tokens || tokens.length === 0) {
      throw new ResourceNotFoundError('Refresh token not found.');
    }

    tokens.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const latestToken = tokens[0];

    if (latestToken.revokedAt) {
      throw new BadRequestError('Refresh token is revoked.');
    }

    if (latestToken.expiresAt.getTime() < Date.now()) {
      throw new BadRequestError('Refresh token is expired.');
    }

    if (latestToken.userId.toString() !== validUserId.toString()) {
      throw new BadRequestError('Session does not belong to this user.');
    }

    await this.refreshTokensRepository.revokeById(latestToken.id);

    const newJWTRefreshToken = await reply.jwtSign(
      {
        role: storedUser.role,
        sessionId: validSessionId.toString(),
        jti: new UniqueEntityID().toString(),
      },
      { sign: { sub: validUserId.toString(), expiresIn: '7d' } },
    );

    const validJWTRefreshToken = Token.create(newJWTRefreshToken);

    const newDBRefreshToken = await this.refreshTokensRepository.create({
      userId: validUserId,
      sessionId: validSessionId,
      token: validJWTRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    if (!newDBRefreshToken) {
      throw new BadRequestError('Unable to create refresh token.');
    }

    const newSession = await this.sessionsRepository.update({
      sessionId: validSessionId,
      ip: validIp,
    });

    if (!newSession) {
      throw new BadRequestError('Unable to update session.');
    }

    const session = sessionToDTO(newSession);
    const refreshToken = refreshTokenToDTO(newDBRefreshToken);

    return { session, refreshToken };
  }
}
