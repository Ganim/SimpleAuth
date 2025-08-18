import { SessionsRepository } from '@/repositories/sessions-repository';

import type { Session } from 'generated/prisma';

export class ListAllActiveSessionsUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(): Promise<{ sessions: Session[] }> {
    const sessions = await this.sessionsRepository.listAllActive();
    return { sessions };
  }
}
