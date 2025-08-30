import { SessionsRepository } from '@/repositories/core/sessions-repository';

import type { Session } from 'generated/prisma';

export class ListUserSessionsByDateUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<{ sessions: Session[] }> {
    const sessions = await this.sessionsRepository.listByUserAndDate(
      userId,
      from,
      to,
    );
    return { sessions };
  }
}
