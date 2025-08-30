import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import {
  sessionToDTO,
  type SessionDTO,
} from '@/mappers/core/session/session-to-dto';
import type { SessionsRepository } from '@/repositories/core/sessions-repository';
import type { UsersRepository } from '@/repositories/core/users-repository';

export interface ListUserSessionsUseCaseRequest {
  userId: string;
}

export interface ListUserSessionsUseCaseResponse {
  sessions: SessionDTO[];
}

export class ListUserSessionsUseCase {
  constructor(
    private sessionsRepository: SessionsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
  }: ListUserSessionsUseCaseRequest): Promise<ListUserSessionsUseCaseResponse> {
    const validId = new UniqueEntityID(userId);

    const user = await this.usersRepository.findById(validId);

    if (!user || user.deletedAt) {
      throw new ResourceNotFoundError('User not found.');
    }

    const sessionsList = await this.sessionsRepository.listByUser(validId);

    if (!sessionsList) {
      throw new ResourceNotFoundError('Sessions not found.');
    }

    const sessions = sessionsList.map(sessionToDTO);

    return { sessions };
  }
}
