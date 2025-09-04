import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { HASH_ROUNDS, PASSWORD_PATTERN } from '@/config/auth';
import { compare as bcryptCompare, hash as bcryptHash } from 'bcryptjs';

export class Password {
  private static readonly DEFAULT_ROUNDS = HASH_ROUNDS ?? 6;
  private _value!: string;

  private constructor(hash: string) {
    this._value = hash;
  }

  static fromHash(hash: string): Password {
    return new Password(hash);
  }

  static async hash(
    password: string,
    rounds: number = Password.DEFAULT_ROUNDS,
  ): Promise<string> {
    return bcryptHash(password, rounds);
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return bcryptCompare(password, hash);
  }

  static isStrong(
    password: string,
    options?: {
      minLength?: number;
      requireUppercase?: boolean;
      requireLowercase?: boolean;
      requireNumber?: boolean;
      requireSpecial?: boolean;
      regex?: RegExp;
    },
  ): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const minLength = options?.minLength ?? 6;
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters.`);
    }
    if (options?.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter.');
    }
    if (options?.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter.');
    }
    if (options?.requireNumber && !/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number.');
    }
    if (options?.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character.');
    }
    if (options?.regex && !options.regex.test(password)) {
      errors.push('Password does not match the required pattern.');
    }
    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static async create(password: string): Promise<Password> {
    const passwordStrong = await Password.isStrong(password, PASSWORD_PATTERN);

    if (!passwordStrong.valid) {
      throw new BadRequestError('Password is not strong enough.');
    }

    const passwordHash = await Password.hash(password);
    const validPassword = Password.fromHash(passwordHash);

    return validPassword;
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  equals(other: Password): boolean {
    return this._value === other.value;
  }
}
