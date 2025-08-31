import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import {
  sessionToDTO,
  type SessionDTO,
} from '@/mappers/core/session/session-to-dto';
import type { SessionsRepository } from '@/repositories/core/sessions-repository';

export interface ListAllActiveSessionsUseCaseResponse {
  sessions: SessionDTO[];
}

export class ListAllActiveSessionsUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(): Promise<ListAllActiveSessionsUseCaseResponse> {
    const sessionsList = await this.sessionsRepository.listAllActive();

    if (!sessionsList) {
      throw new ResourceNotFoundError('Sessions not found.');
    }
    const sessions = sessionsList.map(sessionToDTO);
    return { sessions };
  }
}
