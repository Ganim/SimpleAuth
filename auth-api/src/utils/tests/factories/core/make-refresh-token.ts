import { Token } from '@/entities/core/value-objects/token';
import { UniqueEntityID } from '@/entities/domain/unique-entity-id';
import { InMemoryRefreshTokensRepository } from '@/repositories/core/in-memory/in-memory-refresh-tokens-repository';
import { faker } from '@faker-js/faker/locale/en';

interface makeRefreshTokenProps {
  userId?: string;
  sessionId?: string;
  token?: string;
  expiresAt?: Date;
  refreshTokensRepository: InMemoryRefreshTokensRepository;
}

export async function makeRefreshToken({
  userId = new UniqueEntityID().toValue(),
  sessionId = new UniqueEntityID().toValue(),
  token = faker.string.alphanumeric(32),
  expiresAt = faker.date.soon({ days: 7 }),
  refreshTokensRepository,
}: makeRefreshTokenProps) {
  const refreshToken = await refreshTokensRepository.create({
    userId: new UniqueEntityID(userId),
    sessionId: new UniqueEntityID(sessionId),
    token: Token.create(token, expiresAt),
    expiresAt,
  });

  return refreshToken;
}
