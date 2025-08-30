import { SessionsRepository } from '@/repositories/core/sessions-repository';

import type { Session } from 'generated/prisma';

export class ListUserSessionsUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(userId: string): Promise<{ sessions: Session[] }> {
    const sessions = await this.sessionsRepository.listByUser(userId);
    return { sessions };
  }
}
