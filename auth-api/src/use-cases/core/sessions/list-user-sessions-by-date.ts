import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import {
  sessionToDTO,
  type SessionDTO,
} from '@/mappers/core/session/session-to-dto';
import type { SessionsRepository } from '@/repositories/core/sessions-repository';
import type { UsersRepository } from '@/repositories/core/users-repository';

export interface ListUserSessionsByDateUseCaseRequest {
  userId: string;
  from: Date;
  to: Date;
}

export interface ListUserSessionsByDateUseCaseResponse {
  sessions: SessionDTO[];
}

export class ListUserSessionsByDateUseCase {
  constructor(
    private sessionsRepository: SessionsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    from,
    to,
  }: ListUserSessionsByDateUseCaseRequest): Promise<ListUserSessionsByDateUseCaseResponse> {
    if (from > to) {
      throw new BadRequestError(
        'The "from" date cannot be after the "to" date.',
      );
    }

    const validId = new UniqueEntityID(userId);

    const user = await this.usersRepository.findById(validId);

    if (!user || user.deletedAt) {
      throw new ResourceNotFoundError('User not found.');
    }

    const sessionsList = await this.sessionsRepository.listByUserAndDate(
      validId,
      from,
      to,
    );

    if (!sessionsList) {
      throw new ResourceNotFoundError('Sessions not found.');
    }

    const sessions = sessionsList.map(sessionToDTO);

    return { sessions };
  }
}
