import { RefreshTokensRepository } from '../refresh-tokens-repository';

export interface InMemoryRefreshToken {
  id: string;
  sessionId: string;
  revokedAt: Date | null;
}

export class InMemoryRefreshTokensRepository
  implements RefreshTokensRepository
{
  public items: InMemoryRefreshToken[] = [];

  async revokeBySessionId(sessionId: string): Promise<void> {
    for (const token of this.items) {
      if (token.sessionId === sessionId) {
        token.revokedAt = new Date();
      }
    }
  }
}
