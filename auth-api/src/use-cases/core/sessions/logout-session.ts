import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import type { RefreshTokensRepository } from '@/repositories/core/refresh-tokens-repository';
import type { SessionsRepository } from '@/repositories/core/sessions-repository';

export interface LogoutSessionUseCaseRequest {
  sessionId: string;
}

export class LogoutSessionUseCase {
  constructor(
    private sessionsRepository: SessionsRepository,
    private refreshTokensRepository: RefreshTokensRepository,
  ) {}

  async execute({ sessionId }: LogoutSessionUseCaseRequest): Promise<void> {
    const validId = new UniqueEntityID(sessionId);

    const session = await this.sessionsRepository.findById(validId);

    if (!session || session.expiredAt || session.revokedAt) {
      throw new ResourceNotFoundError('Session not found.');
    }

    const refreshToken =
      await this.refreshTokensRepository.findBySessionId(validId);

    if (!refreshToken) {
      throw new ResourceNotFoundError('Refresh token not found.');
    }

    await this.sessionsRepository.expire(validId);

    await this.refreshTokensRepository.revokeBySessionId(validId);
  }
}
