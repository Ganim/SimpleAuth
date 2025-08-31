import { BadRequestError } from '@/@errors/use-cases/bad-request-error';

// Value Object para Role
export class Role {
  private readonly value: string;

  constructor(value: string) {
    if (!Role.isValid(value)) {
      throw new BadRequestError(`${value} role is invalid.`);
    }
    this.value = value;
  }

  static isValid(value: string): boolean {
    const validRoles = ['USER', 'MANAGER', 'ADMIN'];
    return validRoles.includes(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Role): boolean {
    return this.value === other.value;
  }
}
