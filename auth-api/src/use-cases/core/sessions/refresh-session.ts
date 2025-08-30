import { SessionsRepository } from '@/repositories/core/sessions-repository';

export class RefreshSessionUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(sessionId: string, ip: string): Promise<void> {
    await this.sessionsRepository.updateSessionInfo(sessionId, ip);
  }
}
