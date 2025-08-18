// 409
export class ConflictError extends Error {
  constructor(message: string = 'Conflict error') {
    super(message);
  }
}
