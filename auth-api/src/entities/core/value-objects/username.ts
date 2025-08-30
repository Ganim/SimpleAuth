import { randomUUID } from 'node:crypto';

export class Username {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = Username.format(value);
    if (!Username.isValid(this._value)) {
      throw new Error('Invalid username');
    }
  }

  static isValid(value: string): boolean {
    // 3-20 caracteres, letras, números, underline
    const validUsername = /^[a-zA-Z0-9_]{3,20}$/.test(value);
    return validUsername;
  }

  static format(value: string): string {
    // Remove espaços, converte para minúsculo, substitui espaços por underline
    const formatedUsername = value.trim().toLowerCase().replace(/\s+/g, '_');
    return formatedUsername;
  }

  static random(): Username {
    const randomUsername = `user${randomUUID().slice(0, 8)}`;
    const newRandomUsername = new Username(randomUsername);
    return newRandomUsername;
  }

  static create(value: string): Username {
    const formattedUsername = Username.format(value);
    return new Username(formattedUsername);
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }
  equals(other: Username): boolean {
    return this._value === other.value;
  }
}
