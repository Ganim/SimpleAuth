import type { SessionsRepository } from '@/repositories/sessions-repository';
import type { Session } from 'generated/prisma';

export class CreateSessionUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(userId: string, ip: string): Promise<{ session: Session }> {
    const session = await this.sessionsRepository.create?.({ userId, ip });
    if (!session) throw new Error('Session creation failed');
    return { session };
  }
}
