export class InvalidImportDataError extends Error {
  constructor(message: string) {
    super(`Invalid import data: ${message}`);
    this.name = 'InvalidImportDataError';
  }
}
