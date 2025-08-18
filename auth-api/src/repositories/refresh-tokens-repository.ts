export interface RefreshTokensRepository {
  revokeBySessionId(sessionId: string): Promise<void>;
}
