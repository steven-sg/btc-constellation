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

export function PascalCase(string) {
  const wordArray = string.split(' ');
  return wordArray.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}