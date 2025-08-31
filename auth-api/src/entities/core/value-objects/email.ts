import { BadRequestError } from '@/@errors/use-cases/bad-request-error';

export class Email {
  private readonly _value: string;

  constructor(value: string) {
    if (!Email.isValid(value)) {
      throw new BadRequestError('Invalid email address.');
    }
    this._value = value.trim().toLowerCase();
  }

  static isValid(value: string): boolean {
    // Simple regex for email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
