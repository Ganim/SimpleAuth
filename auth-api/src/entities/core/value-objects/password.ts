import { HASH_ROUNDS } from '@/config/auth';
import { compare as bcryptCompare, hash as bcryptHash } from 'bcryptjs';

export class Password {
  private static readonly DEFAULT_ROUNDS = HASH_ROUNDS ?? 6;

  static fromHash(hash: string): Password {
    const password = Object.create(Password.prototype);
    password._value = hash;
    return password;
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
}
