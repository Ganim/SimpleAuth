import { BadRequestError } from '@/@errors/use-cases/bad-request-error';

export class IpAddress {
  private readonly _value: string;

  constructor(value: string) {
    if (!IpAddress.isValid(value)) {
      throw new BadRequestError('Invalid IP address.');
    }
    this._value = value;
  }

  static isValid(value: string): boolean {
    // Accepts IPv4 and IPv6
    return (
      /^(?:\d{1,3}\.){3}\d{1,3}$/.test(value) || /^[a-fA-F0-9:]+$/.test(value)
    );
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }
}
