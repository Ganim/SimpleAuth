import { BadRequestError } from '@/@errors/use-cases/bad-request-error';

export class Token {
  private readonly _value: string;
  private readonly _expiresAt?: Date;

  constructor(value: string, expiresAt?: Date) {
    if (!Token.isValid(value)) {
      throw new BadRequestError('Invalid token.');
    }
    this._value = value;
    this._expiresAt = expiresAt;
  }

  static isValid(value: string): boolean {
    // Simple validation: not empty and at least 16 characters
    return typeof value === 'string' && value.length >= 16;
  }

  get value(): string {
    return this._value;
  }

  get expiresAt(): Date | undefined {
    return this._expiresAt;
  }

  isExpired(): boolean {
    if (!this._expiresAt) return false;
    return new Date() > this._expiresAt;
  }

  toString(): string {
    return this._value;
  }
}
