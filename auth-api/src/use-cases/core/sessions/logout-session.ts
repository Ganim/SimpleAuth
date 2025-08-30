import { SessionsRepository } from '@/repositories/core/sessions-repository';
import { RefreshTokensRepository } from '../../../repositories/core/refresh-tokens-repository';

export class LogoutSessionUseCase {
  constructor(
    private sessionsRepository: SessionsRepository,
    private refreshTokensRepository: RefreshTokensRepository,
  ) {}

  async execute(sessionId: string): Promise<void> {
    await this.sessionsRepository.expire(sessionId);
    await this.refreshTokensRepository.revokeBySessionId(sessionId);
  }
}
