import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { Role as PrismaRole } from '@prisma/client';

// Lista dinâmica derivada do enum do Prisma (evita duplicação)
const USER_ROLES = Object.values(PrismaRole) as PrismaRole[];

// Traduções das roles
export const userRolesLabels: Record<PrismaRole, string> = {
  ADMIN: 'Administrador',
  MANAGER: 'Gerente',
  USER: 'Usuário',
};

export class Role {
  private readonly _value: PrismaRole;

  private constructor(value: PrismaRole) {
    this._value = value;
  }

  static create(value: string): Role {
    if (!Role.isValid(value)) {
      throw new BadRequestError(
        `Role '${value}' is invalid. Valid roles: ${USER_ROLES.join(', ')}`,
      );
    }
    return new Role(value as PrismaRole);
  }

  static isValid(value: string): value is PrismaRole {
    return USER_ROLES.includes(value as PrismaRole);
  }

  static checkRole(value: string, compare: PrismaRole): boolean {
    return value === compare;
  }

  get value(): PrismaRole {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  equals(other: Role): boolean {
    return this._value === other._value;
  }
}
