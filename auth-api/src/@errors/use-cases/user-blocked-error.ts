import { ForbiddenError } from './forbidden-error';

export class UserBlockedError extends ForbiddenError {
  constructor(public blockedUntil: Date) {
    super('User is temporarily blocked due to failed login attempts');
  }
}
