import { BadRequestError } from '@/@errors/use-cases/bad-request-error';

export class Role {
  private readonly _value: string;

  private constructor(value: string) {
    if (!Role.isValid(value)) {
      throw new BadRequestError(`${value} role is invalid.`);
    }
    this._value = value;
  }

  static create(value: string): Role {
    return new Role(value);
  }

  static isValid(value: string): boolean {
    const validRoles = ['USER', 'MANAGER', 'ADMIN'];
    return validRoles.includes(value);
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  equals(other: Role): boolean {
    return this._value === other.value;
  }
}
