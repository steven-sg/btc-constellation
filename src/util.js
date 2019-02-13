export class OperationResult {
  constructor (success, error) {
    this.success = success;
    if (error) {
      this.error = error;
    } else if (!success) {
      this.error = new Error('You\'ve encountered an unexpected Error.');
    }
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.message = message;
  }
}