import { BadRequestError } from '@/@errors/use-cases/bad-request-error';

export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = Email.format(value);
    if (!Email.isValid(this._value)) {
      throw new BadRequestError('Invalid email address.');
    }
  }

  static create(value: string): Email {
    return new Email(value);
  }

  static isValid(value: string): boolean {
    // Simple regex for email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  static format(value: string): string {
    return value.trim().toLowerCase();
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other.value;
  }
}
