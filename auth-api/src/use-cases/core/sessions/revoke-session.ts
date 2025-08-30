import { SessionsRepository } from '@/repositories/core/sessions-repository';

export class RevokeSessionUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(sessionId: string): Promise<void> {
    await this.sessionsRepository.revoke(sessionId);
  }
}
