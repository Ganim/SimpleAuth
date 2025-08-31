export class ForbiddenError extends Error {
  constructor(message: string = 'Forbidden Error') {
    super(message);
  }
}
