import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { SessionsRepository } from '@/repositories/core/sessions-repository';

interface RevokeSessionUseCaseRequest {
  sessionId: string;
}

export class RevokeSessionUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute({ sessionId }: RevokeSessionUseCaseRequest): Promise<void> {
    const validId = new UniqueEntityID(sessionId);
    const session = await this.sessionsRepository.findById(validId);

    if (!session || session.expiredAt || session.revokedAt) {
      throw new ResourceNotFoundError('Session not found.');
    }

    await this.sessionsRepository.revoke(validId);
  }
}
