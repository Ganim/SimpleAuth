import { SessionsRepository } from '@/repositories/core/sessions-repository';

export class ExpireSessionUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(sessionId: string): Promise<void> {
    await this.sessionsRepository.expire(sessionId);
  }
}
