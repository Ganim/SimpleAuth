import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { IpAddress } from '@/entities/core/value-objects/ip-address';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import {
  sessionToDTO,
  type SessionDTO,
} from '@/mappers/core/session/session-to-dto';
import type { SessionsRepository } from '@/repositories/core/sessions-repository';
import type { UsersRepository } from '@/repositories/core/users-repository';
import type { FastifyReply } from 'fastify';

interface CreateSessionUseCaseRequest {
  userId: string;
  ip: string;
  reply: FastifyReply;
}

interface CreateSessionUseCaseResponse {
  session: SessionDTO;
  token: string;
  refreshToken: string;
}

export class CreateSessionUseCase {
  constructor(
    private sessionsRepository: SessionsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    ip,
    reply,
  }: CreateSessionUseCaseRequest): Promise<CreateSessionUseCaseResponse> {
    const validId = new UniqueEntityID(userId);
    const validIp = new IpAddress(ip);

    const user = await this.usersRepository.findById(validId);

    if (!user || user.deletedAt) {
      throw new ResourceNotFoundError('User not found.');
    }

    const newSession = await this.sessionsRepository.create({
      userId: validId,
      ip: validIp,
    });

    if (!newSession) {
      throw new BadRequestError(
        'Unable to create session. Please verify the provided user ID and IP address.',
      );
    }

    const token = await reply.jwtSign(
      { role: user.role, sessionId: newSession.id.toString() },
      { sign: { sub: user.id.toString() } },
    );

    const refreshToken = await reply.jwtSign(
      { role: user.role, sessionId: newSession.id.toString() },
      { sign: { sub: user.id.toString(), expiresIn: '7d' } },
    );

    const session = sessionToDTO(newSession);

    return { session, token, refreshToken };
  }
}
