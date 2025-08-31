import { BadRequestError } from '@/@errors/use-cases/bad-request-error';

export class Url {
  private readonly value: string;

  constructor(url: string) {
    if (url !== '' && !Url.isValid(url)) {
      throw new BadRequestError(`Invalid URL: ${url}`);
    }
    this.value = url;
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

  public toString(): string {
    return this.value;
  }

  public equals(url: Url): boolean {
    return this.value === url.value;
  }

  public get protocol(): string {
    return this.value === '' ? '' : new globalThis.URL(this.value).protocol;
  }

  public get host(): string {
    return this.value === '' ? '' : new globalThis.URL(this.value).host;
  }

  public get pathname(): string {
    return this.value === '' ? '' : new globalThis.URL(this.value).pathname;
  }

  public get search(): string {
    return this.value === '' ? '' : new globalThis.URL(this.value).search;
  }

  public get hash(): string {
    return this.value === '' ? '' : new globalThis.URL(this.value).hash;
  }
}
