//401
export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized error') {
    super(message);
  }
}
