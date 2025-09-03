import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { UserDTO, userToDTO } from '@/mappers/core/user/user-to-dto';
import type { SessionsRepository } from '@/repositories/core/sessions-repository';
import type { UsersRepository } from '@/repositories/core/users-repository';

interface ListOnlineUsersUseCaseResponse {
  users: UserDTO[];
}

export class ListOnlineUsersUseCase {
  constructor(
    private sessionsRepository: SessionsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(): Promise<ListOnlineUsersUseCaseResponse> {
    // Busca todas as sessões ativas
    const activeSessions = await this.sessionsRepository.listAllActive();

    if (!activeSessions || activeSessions.length === 0) {
      throw new ResourceNotFoundError('No active sessions found.');
    }

    // Extrai IDs únicos dos usuários com sessões ativas
    const uniqueUserIds = [
      ...new Set(activeSessions.map((session) => session.userId.toString())),
    ];

    // Busca os usuários correspondentes
    const onlineUsers = await Promise.all(
      uniqueUserIds.map((userId) =>
        this.usersRepository.findById(new UniqueEntityID(userId)),
      ),
    );

    // Filtra usuários válidos (não deletados) e converte para DTO
    const validUsers = onlineUsers
      .filter((user) => user && !user.deletedAt)
      .map((user) => userToDTO(user!));

    if (validUsers.length === 0) {
      throw new ResourceNotFoundError('No online users found.');
    }

    return { users: validUsers };
  }
}
