export class OperationResult {
  constructor (success, error) {
    this.success = success;
    this.error = error;
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.message = message;
  }
}