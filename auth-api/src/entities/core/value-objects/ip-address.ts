import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { isIPv4, isIPv6 } from 'node:net';

export class IpAddress {
  private readonly _value: string;

  private constructor(value: string) {
    if (!IpAddress.isValid(value)) {
      throw new BadRequestError('Invalid IP address.');
    }
    this._value = value;
  }

  static create(value: string): IpAddress {
    return new IpAddress(value);
  }

  static isValid(value: string): boolean {
    return isIPv4(value) || isIPv6(value);
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  equals(other: IpAddress): boolean {
    return this._value === other.value;
  }
}
