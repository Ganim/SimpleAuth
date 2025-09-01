import { BadRequestError } from '@/@errors/use-cases/bad-request-error';

export class Url {
  private readonly _value: string;

  private constructor(url: string) {
    if (url !== '' && !Url.isValid(url)) {
      throw new BadRequestError(`Invalid URL: ${url}`);
    }
    this._value = url;
  }

  public static create(url: string): Url {
    return new Url(url);
  }

  public static isValid(url: string): boolean {
    try {
      new globalThis.URL(url);
      return true;
    } catch {
      return false;
    }
  }

  public static empty(): Url {
    return new Url('');
  }

  public get value(): string {
    return this._value;
  }

  public toString(): string {
    return this._value;
  }

  public equals(url: Url): boolean {
    return this._value === url.value;
  }

  public get protocol(): string {
    return this._value === '' ? '' : new globalThis.URL(this._value).protocol;
  }

  public get host(): string {
    return this._value === '' ? '' : new globalThis.URL(this._value).host;
  }

  public get pathname(): string {
    return this._value === '' ? '' : new globalThis.URL(this._value).pathname;
  }

  public get search(): string {
    return this._value === '' ? '' : new globalThis.URL(this._value).search;
  }

  public get hash(): string {
    return this._value === '' ? '' : new globalThis.URL(this._value).hash;
  }
}
